"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers } from "@/store/features/user/userSlice";
import { cn } from "@/lib/utils";

interface MentionTextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  name?: string;
}

export function MentionTextarea({
  value,
  onChange,
  onBlur,
  className,
  ...props
}: MentionTextareaProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [atIndex, setAtIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers({ limit: 1000 }));
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    return name.toLowerCase().includes(query.toLowerCase()) ||
           email.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const selectionStart = e.target.selectionStart;
      setCursorPos(selectionStart);

      const textBeforeCursor = newValue.substring(0, selectionStart);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        const charBeforeAt = textBeforeCursor[lastAtIndex - 1];
        if (
          (lastAtIndex === 0 || !charBeforeAt || /\s/.test(charBeforeAt)) &&
          !/\s/.test(textAfterAt)
        ) {
          setQuery(textAfterAt);
          setAtIndex(lastAtIndex);
          setOpen(true);
          onChange(newValue);
          return;
        }
      }

      setOpen(false);
      setAtIndex(-1);
      onChange(newValue);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (userEmail: string) => {
      if (atIndex === -1) return;

      const textBefore = value.substring(0, atIndex);
      const textAfter = value.substring(cursorPos);
      const newValue = `${textBefore}@${userEmail} ${textAfter}`;

      onChange(newValue);
      setOpen(false);
      setAtIndex(-1);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = textBefore.length + userEmail.length + 2;
          textareaRef.current.setSelectionRange(newPos, newPos);
          setCursorPos(newPos);
        }
      }, 0);
    },
    [value, atIndex, cursorPos, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!open || filteredUsers.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredUsers.length - 1,
        );
      } else if (e.key === "Enter" && open) {
        e.preventDefault();
        handleSelect(filteredUsers[selectedIndex].email);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, filteredUsers, selectedIndex, handleSelect],
  );

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
          className,
        )}
      />

      {open && filteredUsers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 z-50 mt-1 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredUsers.map((user, index) => (
              <button
                key={user._id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(user.email);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors",
                  index === selectedIndex
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted/50",
                )}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-semibold text-foreground truncate">{user.name}</span>
                  <span className="text-[9px] text-muted-foreground truncate">{user.email}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
