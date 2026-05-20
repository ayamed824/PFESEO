function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-6">
      <nav className="space-y-2">

        <div className="font-semibold text-primary mb-4">
          Main Dashboard
        </div>

        <SidebarItem icon="wrench" text="Technical SEO" />
        <SidebarItem icon="file-lines" text="Content Analysis" />
        <SidebarItem icon="paintbrush" text="UX / UI" />
        <SidebarItem icon="star" text="Popularity" />
        <SidebarItem icon="robot" text="AI Agents" />

      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
      <i className={`fa-solid fa-${icon} mr-3 text-gray-600`}></i>
      <span>{text}</span>
    </div>
  );
}

export default Sidebar;

