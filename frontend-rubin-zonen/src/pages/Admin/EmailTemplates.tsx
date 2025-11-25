import { useState, useEffect } from "react";
import { getEmailTemplates, updateEmailTemplate } from "@/services/emailTemplates";
import type { EmailTemplate } from "@/models/models";
import { useRedirectIfNotAdmin } from "@/hooks/useRedirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EmailTemplates() {
    useRedirectIfNotAdmin();
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getEmailTemplates();
                setTemplates(data);
            } catch (error) {
                console.error("Error fetching email templates:", error);
                toast.error("Failed to fetch email templates.");
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleEditClick = (template: EmailTemplate) => {
        setSelectedTemplate(JSON.parse(JSON.stringify(template)));
        setIsDialogOpen(true);
    };

    const handleSaveChanges = async () => {
        if (!selectedTemplate) return;

        try {
            const updated = await updateEmailTemplate(selectedTemplate.id, selectedTemplate.subject, selectedTemplate.body);
            toast.success("Template updated successfully.");
            setIsDialogOpen(false);
            setTemplates(templates.map(t => t.id === updated.id ? updated : t));
            setSelectedTemplate(null);
        } catch (error) {
            console.error("Error updating email template:", error);
            toast.error("Failed to update email template.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4 bg-secondary rounded-md h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[80vh]">
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <Card key={template.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <p><strong>Subject</strong> : {template.subject}</p>
                                            <Button onClick={() => handleEditClick(template)}>Edit</Button>
                                        </div>
                                        <p><strong>Body</strong> :</p>
                                        <div className="p-2 border rounded-md mt-1 bg-secondary dark:bg-gray-800">
                                            <pre className="whitespace-pre-wrap font-sans">{template.body}</pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
                                <DialogDescription>
                                    Make changes to your email template here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={selectedTemplate?.subject || ""}
                                        onChange={(e) => setSelectedTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="body" className="text-right">
                                        Body
                                    </Label>
                                    <Textarea
                                        id="body"
                                        value={selectedTemplate?.body || ""}
                                        onChange={(e) => setSelectedTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                                        className="col-span-3 min-h-[200px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveChanges}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}

export default EmailTemplates;
