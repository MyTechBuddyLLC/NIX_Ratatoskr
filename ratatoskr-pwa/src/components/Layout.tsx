import { Outlet, NavLink } from "react-router-dom";
import type { ReactNode } from "react";

// Placeholder Icons
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TaskIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const QueueIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const SuggestedIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ReposIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>;
const ConfigIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const GithubIcon = () => <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-foreground-muted-dark group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>;
const CloudflareIcon = () => <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-foreground-muted-dark group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.687 11.813c.047-.422.125-.828.219-1.234h5.047V5.53c-1.375.344-2.625.906-3.719 1.688-.578.406-1.109.859-1.594 1.36-.937.984-1.641 2.141-2.141 3.422H4.687zM18.86 11.813V7.219c-.563-.422-1.156-.797-1.781-1.125-.969-.484-2.016-.813-3.109-.984V0c1.828.188 3.547.75 5.078 1.672.984.609 1.86 1.406 2.594 2.39 1.25 1.625 2.031 3.563 2.219 5.75H18.86zM4.906 12.188H.203c-.188 2.188.594 4.125 1.844 5.75.734.984 1.609 1.781 2.594 2.391C6.453 21.25 8.172 21.813 10 22v-5.156c-1.094-.172-2.141-.5-3.109-.984-.625-.328-1.219-.703-1.781-1.125L4.906 12.188zM18.86 12.188h4.688c-.188-2.188-1-4.125-2.234-5.75-.484-.641-1.016-1.234-1.594-1.719-1.094-.781-2.344-1.344-3.719-1.688v5.048h5.047c.094.406.172.813.219 1.235zM14 16.844V22c1.828-.188 3.547-.75 5.078-1.672.984-.609 1.86-1.406 2.594-2.39 1.25-1.625 2.031-3.563 2.219-5.75H14v4.656z" /></svg>;

interface NavItemProps { to: string; icon: ReactNode; text: string; disabled?: boolean; }

const SidebarNavLink = ({ to, icon, text, disabled = false }: NavItemProps) => {
    if (disabled) {
        return (
            <div className="flex items-center p-2 text-gray-400 dark:text-foreground-muted-dark rounded-lg cursor-not-allowed group" title="Coming Soon">
                {icon}
                <span className="ms-3">{text}</span>
            </div>
        );
    }
    return (
        <NavLink to={to} className={({ isActive }) =>
            `flex items-center p-2 text-foreground-light rounded-lg dark:text-foreground-dark hover:bg-secondary-light dark:hover:bg-secondary-dark group ${isActive ? 'bg-secondary-light dark:bg-secondary-dark' : ''}`
        }>
            {icon}
            <span className="ms-3">{text}</span>
        </NavLink>
    );
};

const MobileNavLink = ({ to, icon, text, disabled = false }: NavItemProps) => {
    if (disabled) {
        return (
            <div className="inline-flex flex-col items-center justify-center px-5 text-gray-400 dark:text-foreground-muted-dark cursor-not-allowed" title="Coming Soon">
                {icon}
                <span className="text-sm">{text}</span>
            </div>
        );
    }
    return (
        <NavLink to={to} className={({ isActive }) =>
            `inline-flex flex-col items-center justify-center px-5 hover:bg-secondary-light dark:hover:bg-secondary-dark group ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-foreground-muted-dark'}`
        }>
            {icon}
            <span className="text-sm">{text}</span>
        </NavLink>
    );
};

export function Layout() {
    const navItems: NavItemProps[] = [
        { to: "/", icon: <DashboardIcon />, text: "Dashboard" },
        { to: "/tasks", icon: <TaskIcon />, text: "Tasks" },
        { to: "/queue", icon: <QueueIcon />, text: "Queue" },
        { to: "/suggested", icon: <SuggestedIcon />, text: "Suggested", disabled: true },
        { to: "/repos", icon: <ReposIcon />, text: "Repos" },
        { to: "/config", icon: <ConfigIcon />, text: "Config" },
    ];

    const mobileNavItems = navItems.filter(item => item.to !== '/repos');

    return (
        <div className="antialiased bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
            {/* Desktop Sidebar */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
                <div className="h-full px-3 py-4 overflow-y-auto bg-primary-light dark:bg-primary-dark flex flex-col">
                    <a href="/" className="flex flex-col items-center mb-5">
                        <img src="/Ratatoskr.png" alt="Ratatoskr Logo" className="w-16 h-16 mb-2" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ratatoskr</span>
                    </a>
                    <ul className="space-y-2 font-medium">
                        {navItems.map(item => <li key={item.to}><SidebarNavLink {...item} /></li>)}
                    </ul>
                    <div className="mt-auto pt-4 space-y-2 font-medium border-t border-secondary-light dark:border-secondary-dark">
                         <a href="github://" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-foreground-dark hover:bg-secondary-light dark:hover:bg-secondary-dark group">
                            <GithubIcon />
                            <span className="ms-3">GitHub</span>
                        </a>
                        <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-foreground-dark hover:bg-secondary-light dark:hover:bg-secondary-dark group">
                            <CloudflareIcon />
                            <span className="ms-3">Cloudflare</span>
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="sm:ml-64 pb-24 sm:pb-4">
                <div className="p-4 min-h-screen">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Tab Navigation */}
            <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-primary-light border-t border-secondary-light dark:bg-primary-dark dark:border-secondary-dark sm:hidden">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                    {mobileNavItems.map(item => <MobileNavLink key={item.to} {...item} />)}
                </div>
            </div>
        </div>
    );
}
