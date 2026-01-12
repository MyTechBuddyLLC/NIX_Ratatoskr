import type { ComponentChildren } from "preact";
import { Link } from "preact-router/match";

interface LayoutProps {
  children: ComponentChildren;
}

// Simple placeholder icons for navigation
const TaskIcon = () => <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const ScheduledIcon = () => <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const ConfigIcon = () => <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;

interface NavLinkProps {
  path: string;
  icon: ComponentChildren;
  text: string;
}

const NavLink = ({ path, icon, text }: NavLinkProps) => (
    <Link
        activeClassName="bg-gray-200 dark:bg-gray-700"
        path={path}
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
        {icon}
        <span class="ms-3">{text}</span>
    </Link>
);

const MobileNavLink = ({ path, icon, text }: NavLinkProps) => (
    <Link
        activeClassName="text-blue-600 dark:text-blue-500"
        path={path}
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
        {icon}
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{text}</span>
    </Link>
);

export function Layout({ children }: LayoutProps) {
  return (
    <div class="antialiased bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <aside class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div class="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                <a href="/" class="flex items-center ps-2.5 mb-5">
                    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Jules PWA</span>
                </a>
                <ul class="space-y-2 font-medium">
                    <li><NavLink path="/" icon={<TaskIcon />} text="Tasks" /></li>
                    <li><NavLink path="/scheduled" icon={<ScheduledIcon />} text="Scheduled" /></li>
                    <li><NavLink path="/config" icon={<ConfigIcon />} text="Config" /></li>
                </ul>
            </div>
        </aside>

        {/* Main Content */}
        <main class="sm:ml-64 pb-16 sm:pb-0">
             <div class="p-4 min-h-screen">
                {children}
            </div>
        </main>

        {/* Mobile Bottom Tab Navigation */}
        <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 sm:hidden">
            <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                <MobileNavLink path="/" icon={<TaskIcon />} text="Tasks" />
                <MobileNavLink path="/scheduled" icon={<ScheduledIcon />} text="Scheduled" />
                <MobileNavLink path="/config" icon={<ConfigIcon />} text="Config" />
            </div>
        </div>
    </div>
  );
}
