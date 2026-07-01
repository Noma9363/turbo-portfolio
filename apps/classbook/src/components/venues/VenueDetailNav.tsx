import { cn } from "@repo/ui";

interface Tab {
    id: string;
    label: string;
}

interface Props {
    tabs: Tab[];
    activeId: string;
    onTabClick: (id: string) => void;
}

export function VenueDetailNav({ tabs, activeId, onTabClick }: Props) {
    return (
        <nav>
            <ul className="list-none p-0 flex flex-row relative">
                <div
                    className="absolute h-0.5 bottom-0 left-0 bg-accent-foreground transition-transform duration-300"
                    style={{
                        width: `${100 / tabs.length}%`,
                        transform: `translateX(${tabs.findIndex(t => t.id === activeId) * 100}%)`,
                    }}
                />
                {tabs.map((t) => (
                    <li key={t.id} className={cn("flex-1")}>
                        <button
                            className={cn("text-center mx-auto w-full")}
                            onClick={() => onTabClick(t.id)}
                            data-active={activeId === t.id}
                        >
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
