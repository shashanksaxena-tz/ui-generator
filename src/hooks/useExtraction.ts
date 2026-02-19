"use client";

import { useState, useCallback } from "react";
import type { SchemaNode } from "@/types";

export interface SelectedEntry {
  node: SchemaNode;
  pathKey: string; // e.g. "0-1-2" (path indices joined by dash)
  label: string;   // human-readable component name, e.g. "Button"
}

export interface UseExtractionReturn {
  isExtractMode: boolean;
  selectedEntries: SelectedEntry[];
  isPanelOpen: boolean;
  propsOverrides: Map<string, Record<string, unknown>>;
  toggleExtractMode: () => void;
  handleNodeSelect: (node: SchemaNode, pathKey: string, shiftKey: boolean) => void;
  isNodeSelected: (pathKey: string) => boolean;
  closePanel: () => void;
  clearSelection: () => void;
  setPropsOverride: (pathKey: string, props: Record<string, unknown>) => void;
}

export function useExtraction(): UseExtractionReturn {
  const [isExtractMode, setIsExtractMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<SelectedEntry[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [propsOverrides, setPropsOverridesMap] = useState<Map<string, Record<string, unknown>>>(new Map());

  const toggleExtractMode = useCallback(() => {
    setIsExtractMode((prev) => {
      if (prev) {
        // Turning extract mode OFF: clear selection, panel, and all prop overrides
        setSelectedEntries([]);
        setIsPanelOpen(false);
        setPropsOverridesMap(new Map());
      }
      return !prev;
    });
  }, []);

  const setPropsOverride = useCallback((pathKey: string, props: Record<string, unknown>) => {
    setPropsOverridesMap((prev) => {
      const next = new Map(prev);
      next.set(pathKey, props);
      return next;
    });
  }, []);

  const handleNodeSelect = useCallback(
    (node: SchemaNode, pathKey: string, shiftKey: boolean) => {
      const entry: SelectedEntry = {
        node,
        pathKey,
        label: node.type,
      };

      if (!shiftKey) {
        // Single-select: replace entire selection with this node
        setSelectedEntries([entry]);
      } else {
        // Multi-select with Shift: toggle this node in the list
        setSelectedEntries((prev) => {
          const alreadySelected = prev.some((e) => e.pathKey === pathKey);
          if (alreadySelected) {
            // Remove it
            return prev.filter((e) => e.pathKey !== pathKey);
          } else {
            // Add it
            return [...prev, entry];
          }
        });
      }

      // Open the panel whenever a selection is made
      setIsPanelOpen(true);
    },
    []
  );

  const isNodeSelected = useCallback(
    (pathKey: string): boolean => {
      return selectedEntries.some((e) => e.pathKey === pathKey);
    },
    [selectedEntries]
  );

  const closePanel = useCallback(() => {
    // Close the panel but keep selectedEntries and isExtractMode unchanged
    setIsPanelOpen(false);
  }, []);

  const clearSelection = useCallback(() => {
    // Clear entries and close panel, but keep isExtractMode on
    setSelectedEntries([]);
    setIsPanelOpen(false);
  }, []);

  return {
    isExtractMode,
    selectedEntries,
    isPanelOpen,
    propsOverrides,
    toggleExtractMode,
    handleNodeSelect,
    isNodeSelected,
    closePanel,
    clearSelection,
    setPropsOverride,
  };
}
