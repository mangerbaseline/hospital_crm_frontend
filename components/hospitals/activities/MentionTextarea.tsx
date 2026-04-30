"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers } from "@/store/features/user/userSlice";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MentionTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function MentionTextarea({
  value,
  onChange,
  className,
  ...props
}: MentionTextareaProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [cursorPos, setCursorPos] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [popoverPosition, setPopoverPosition] = React.useState({
    top: 0,
    left: 0,
  });

  React.useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers({ limit: 1000 }));
    }
  }, [dispatch, users.length]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const selectionStart = e.target.selectionStart;
    setCursorPos(selectionStart);

    const textBeforeCursor = newValue.substring(0, selectionStart);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbolIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbolIndex + 1);
      // Only trigger if @ is at start of word or start of line
      const charBeforeAt = textBeforeCursor[lastAtSymbolIndex - 1];
      if (!charBeforeAt || /\s/.test(charBeforeAt)) {
        if (!/\s/.test(textAfterAt)) {
          setQuery(textAfterAt);
          setOpen(true);
          calculatePopoverPosition(selectionStart);
          onChange(e);
          return;
        }
      }
    }

    setOpen(false);
    onChange(e);
  };

  const calculatePopoverPosition = (index: number) => {
    if (!textareaRef.current) return;

    // Use a simpler approach: anchor the popover to the textarea but adjust its offset
    // or just show it below the line.
    // Since implementing a full mirror div is complex, we'll use the cursor position
    // to estimate if it's near the top or bottom.

    // For now, let's stick to a robust below-textarea position or a fixed relative position
    // that doesn't break.
    const { offsetTop, offsetLeft, clientHeight } = textareaRef.current;

    // We'll anchor the PopoverContent relative to the Textarea
    setPopoverPosition({
      top: 40, // Offset from the top of the container
      left: 0,
    });
  };

  const handleSelect = (userName: string) => {
    if (!textareaRef.current) return;

    const textBeforeAt = value.substring(
      0,
      value.lastIndexOf("@", cursorPos - 1),
    );
    const textAfterCursor = value.substring(cursorPos);
    const newValue = `${textBeforeAt}@${userName} ${textAfterCursor}`;

    const newEvent = {
      target: {
        ...textareaRef.current,
        value: newValue,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(newEvent);
    setOpen(false);

    // Focus back and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = textBeforeAt.length + userName.length + 2;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <Textarea
            {...props}
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            className={cn("relative z-0", className)}
          />
        </PopoverAnchor>

        <PopoverContent
          className="p-0 w-64 shadow-xl border-border rounded-xl z-50"
          align="start"
          side="bottom"
          sideOffset={-40}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="rounded-xl">
            <CommandList className="max-h-48 overflow-y-auto no-scrollbar">
              <CommandEmpty className="py-4 text-xs text-muted-foreground text-center">
                No coworkers found.
              </CommandEmpty>
              <CommandGroup heading="Mention Coworker">
                {users
                  .filter((user) =>
                    user.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((user) => (
                    <CommandItem
                      key={user._id}
                      value={user.name}
                      onSelect={() => handleSelect(user.name)}
                      className="text-xs py-2 px-3 cursor-pointer flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-muted-foreground">
                        @{user.name}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
