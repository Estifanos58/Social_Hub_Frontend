import Image from "next/image";
import Link from "next/link";

export const SidebarItem = ({
    icon,
    label,
    collapsed,
    image,
    link,
  }: {
    icon: any;
    label: string;
    collapsed: boolean;
    image?: string;
    link?: string;  
  }) => (
    <Link href={link || "#"}>
    <div
      // onClick={() => setIsCollapsed(!isCollapsed)}
      className="flex items-center space-x-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition"
    >
      {image ? (
        <Image src={image} width={32} height={32} alt={label} />
      ) : (
        <span className="text-2xl">{icon}</span>
      )}
      {!collapsed && <span className="text-lg font-medium">{label}</span>}
    </div>
    </Link>
  );