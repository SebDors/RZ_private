import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCookie } from '@/hooks/use-cookie';
import { PanelLeftClose } from "lucide-react"
import { useSidebar } from '@/components/ui/sidebar';


export function Header() {
  const [language, setLanguage] = useCookie('language');
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-950">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeftClose className="size-5 rotate-180" />
          </Button>
        )}
      </div>
      <div className="flex items-center">
        <Link to="/my-account/settings">
          <Button variant="outline">My Account</Button>
        </Link>
        <Select value={language || ''} onValueChange={setLanguage}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* TODO à verifier et implementer */}
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Deutsch">Deutsch</SelectItem>
              <SelectItem value="Français">Français</SelectItem>
              <SelectItem value="Italiano">Italiano</SelectItem>
              <SelectItem value="Español">Español</SelectItem>
              <SelectItem value="中文">中文</SelectItem>
              <SelectItem value="Русский">Русский</SelectItem>
              <SelectItem value="日本語">日本語</SelectItem>
              <SelectItem value="العربية">العربية</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

export default Header;