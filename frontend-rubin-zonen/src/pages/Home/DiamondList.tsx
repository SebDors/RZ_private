import { useState, useEffect } from "react";
import { getAllDiamonds } from "../../services/api.tsx";
import type { Diamant } from "../../models/models";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function DiamondList() {
    const [diamonds, setDiamonds] = useState<Diamant[]>([]);

    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                const diamonds = await getAllDiamonds();
                setDiamonds(diamonds);
            } catch (error) {
                console.error("Error fetching diamonds:", error);
            }
        };

        fetchDiamonds();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Card>
                    <CardHeader>
                        <CardTitle>Diamond List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {diamonds.map((diamond) => (
                                <Card key={diamond.stock_id}>
                                    <CardHeader>
                                        <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Color: {diamond.color}</p>
                                        <p>Clarity: {diamond.clarity}</p>
                                        <p>Price/Carat: ${diamond.price_carat}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DiamondList;