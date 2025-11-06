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
import logo from '@/assets/logos/logo blanc front BLEU_page-0001.jpg';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-950">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="w-9 h-16" />
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/my-account">
          <Button variant="outline">My Account</Button>
        </Link>
        <Select>
          <SelectTrigger className="w-[180px]">
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