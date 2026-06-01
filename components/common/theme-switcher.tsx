"use client";

import type { Selection } from "@heroui/react";
import { Button, Dropdown, Label, Tooltip } from "@heroui/react";
import { LucideMonitor, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  const [selected, setSelected] = useState<Selection>(
    new Set(["light", "dark", "system"]),
  );

  return (
    <Dropdown>
      <Tooltip delay={500}>
        <Button isIconOnly aria-label="Menu" variant="secondary">
          {theme === "dark" ? (
            <LucideMoon />
          ) : theme === "light" ? (
            <LucideSun />
          ) : (
            <LucideMonitor />
          )}
        </Button>
        <Tooltip.Content>
          <div className="flex flex-col gap-1 p-1">
            <p className="font-semibold">Theme Switcher</p>
            <p className="text-xs text-muted">Active theme: {theme}</p>
          </div>
        </Tooltip.Content>
      </Tooltip>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectedKeys={selected}
          selectionMode="single"
          onSelectionChange={setSelected}
          onAction={(key) => setTheme(key as string)}
        >
          <Dropdown.Item id="light" textValue="Light">
            {theme === "light" && <Dropdown.ItemIndicator />}
            <LucideSun className="size-4" />
            <Label>Light</Label>
          </Dropdown.Item>

          <Dropdown.Item id="dark" textValue="Dark">
            {theme === "dark" && <Dropdown.ItemIndicator />}
            <LucideMoon className="size-4" />
            <Label>Dark</Label>
          </Dropdown.Item>

          <Dropdown.Item id="system" textValue="System">
            {theme === "system" && <Dropdown.ItemIndicator />}
            <LucideMonitor className="size-4" />
            <Label>System</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
