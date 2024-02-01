import { Accordion, AccordionItem } from "@nextui-org/react";
import { HistoryConversation } from "api/interfaces/StructHistoryConversation.ts";
import React, { ReactElement, useEffect, useState } from "react";

export type OnSelectConversationCallback = (sessionId: string) => void;
export type OnDeleteConversationCallback = (sessionId: string) => void;
export type OnRenameConversationCallback = (
    sessionId: string,
    newName: string
) => void;

export interface ChatConversationHistoryProps
    extends React.ComponentProps<"div"> {
    historyConversations: HistoryConversation[];
    onSelectConversation?: OnSelectConversationCallback;
    onDeleteConversation?: OnDeleteConversationCallback;
    onRenameConversation?: OnRenameConversationCallback;
}

export default function ChatConversationHistory({
    historyConversations,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    ...otherProps
}: ChatConversationHistoryProps) {
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [historyConversationMapIdView, setHistoryConversationMapIdView] =
        useState(new Map<string, HistoryConversation>());
    const [historyConversationMapDateView, setHistoryConversationMapDateView] =
        useState(new Map<string, HistoryConversation[]>());

    useEffect(() => {
        setHistoryConversationMapIdView(
            historyConversations.reduce((map, entry) => {
                map.set(entry.id, entry);
                return map;
            }, new Map<string, HistoryConversation>())
        );
    }, [historyConversations]);

    useEffect(() => {
        const historyConversations = Array.from(
            historyConversationMapIdView.values()
        );
        historyConversations.sort(
            (a, b) =>
                new Date(b.dateTimeIso).getTime() -
                new Date(a.dateTimeIso).getTime()
        );
        setHistoryConversationMapDateView(
            historyConversations.reduce((map, entry) => {
                const date = new Date(entry.dateTimeIso);
                const localeDateString = date.toLocaleDateString();
                if (!map.has(localeDateString)) {
                    map.set(localeDateString, []);
                }
                map.get(localeDateString)!.push(entry);
                return map;
            }, new Map<string, HistoryConversation[]>())
        );
    }, [historyConversationMapIdView]);

    const accordionItems: ReactElement[] = [];
    historyConversationMapDateView.forEach((value, key) => {
        accordionItems.push(
            <AccordionItem title={key}>
                <HistoryConversationList
                    key={null}
                    onConversationEntryClick={(child) => {
                        // TODO: Do real handling logic
                        setSelectedSessionId(child.key!);
                    }}
                >
                    {value.map((value) => (
                        <HistoryConversationEntry
                            key={value.id}
                            selected={selectedSessionId === value.id}
                        >
                            {value.title}
                        </HistoryConversationEntry>
                    ))}
                </HistoryConversationList>
            </AccordionItem>
        );
    });

    return (
        <div {...otherProps}>
            <Accordion>{...accordionItems}</Accordion>
        </div>
    );
}

interface ConversationListProps extends React.ComponentProps<"ul"> {
    onConversationEntryClick?: (
        child: ReactElement<ConversationEntryProps>
    ) => void;
}

function HistoryConversationList({
    onConversationEntryClick,
    children,
    ...otherProps
}: ConversationListProps) {
    if (!children) {
        return <></>;
    }

    let childrenVariable = children;
    if (onConversationEntryClick) {
        childrenVariable = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as ReactElement, {
                    onClick: () => {
                        onConversationEntryClick(child as ReactElement);
                    }
                });
            }
            return child;
        })!;
    }

    return (
        <ul className="flex flex-col items-center" {...otherProps}>
            {childrenVariable}
        </ul>
    );
}

interface ConversationEntryProps extends React.ComponentProps<"li"> {
    selected?: boolean;
}

function HistoryConversationEntry({
    selected,
    children,
    ...otherProps
}: ConversationEntryProps) {
    return (
        <li
            className={`
                w-full select-none rounded-2xl
                active:bg-secondary-400 hover:bg-secondary-200 my-0.5
                text-sm px-3 py-2 cursor-pointer
                ${selected ? "bg-secondary-300" : ""}
            `}
            {...otherProps}
        >
            {children}
        </li>
    );
}
