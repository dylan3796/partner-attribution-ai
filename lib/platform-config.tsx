"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { PlatformConfig, FeatureFlags, ComplexityLevel, UIDensity } from "./types";
import { DEFAULT_PLATFORM_CONFIG } from "./types";

type PlatformConfigContextType = {
  config: PlatformConfig;
  updateFeatureFlag: (flag: keyof FeatureFlags, enabled: boolean) => void;
  setComplexityLevel: (level: ComplexityLevel) => void;
  setUIDensity: (density: UIDensity) => void;
  toggleModule: (module: string) => void;
  isFeatureEnabled: (flag: keyof FeatureFlags) => boolean;
  isModuleEnabled: (module: string) => boolean;
  resetToDefaults: () => void;
  updateBranding: (branding: Partial<PlatformConfig["customBranding"]>) => void;
};

const PlatformConfigContext = createContext<PlatformConfigContextType | null>(null);

const STORAGE_KEY = "partnerai_platform_config";

function loadConfig(): PlatformConfig {
  if (typeof window === "undefined") return DEFAULT_PLATFORM_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return {
        ...DEFAULT_PLATFORM_CONFIG,
        ...parsed,
        featureFlags: { ...DEFAULT_PLATFORM_CONFIG.featureFlags, ...parsed.featureFlags },
        customBranding: { ...DEFAULT_PLATFORM_CONFIG.customBranding, ...parsed.customBranding },
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PLATFORM_CONFIG;
}

function saveConfig(config: PlatformConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function PlatformConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);

  // Load from localStorage on mount
  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  // Persist on changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Apply UI density as CSS variable
  useEffect(() => {
    const densityMap: Record<UIDensity, string> = {
      compact: "0.6rem",
      comfortable: "1rem",
      spacious: "1.4rem",
    };
    document.documentElement.style.setProperty("--ui-density-padding", densityMap[config.uiDensity]);
  }, [config.uiDensity]);

  const updateFeatureFlag = useCallback((flag: keyof FeatureFlags, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      featureFlags: { ...prev.featureFlags, [flag]: enabled },
    }));
  }, []);

  const setComplexityLevel = useCallback((level: ComplexityLevel) => {
    setConfig(prev => ({ ...prev, complexityLevel: level }));
  }, []);

  const setUIDensity = useCallback((density: UIDensity) => {
    setConfig(prev => ({ ...prev, uiDensity: density }));
  }, []);

  const toggleModule = useCallback((module: string) => {
    setConfig(prev => {
      const modules = prev.enabledModules.includes(module)
        ? prev.enabledModules.filter(m => m !== module)
        : [...prev.enabledModules, module];
      return { ...prev, enabledModules: modules };
    });
  }, []);

  const isFeatureEnabled = useCallback((flag: keyof FeatureFlags) => {
    return config.featureFlags[flag];
  }, [config.featureFlags]);

  const isModuleEnabled = useCallback((module: string) => {
    return config.enabledModules.includes(module);
  }, [config.enabledModules]);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_PLATFORM_CONFIG);
  }, []);

  const updateBranding = useCallback((branding: Partial<PlatformConfig["customBranding"]>) => {
    setConfig(prev => ({
      ...prev,
      customBranding: { ...prev.customBranding, ...branding },
    }));
  }, []);

  return (
    <PlatformConfigContext.Provider
      value={{
        config,
        updateFeatureFlag,
        setComplexityLevel,
        setUIDensity,
        toggleModule,
        isFeatureEnabled,
        isModuleEnabled,
        resetToDefaults,
        updateBranding,
      }}
    >
      {children}
    </PlatformConfigContext.Provider>
  );
}

export function usePlatformConfig() {
  const ctx = useContext(PlatformConfigContext);
  if (!ctx) throw new Error("usePlatformConfig must be used within PlatformConfigProvider");
  return ctx;
}
