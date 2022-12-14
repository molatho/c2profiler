export type AppFlow = "setup" | "edit" | "test" | "export";
export const AppFlowItems: AppFlow[] = ["setup", "edit", "test", "export"];

export const isFirstFlowStep = (step: AppFlow): boolean => AppFlowItems.indexOf(step) == 0;
export const isLastFlowStep = (step: AppFlow): boolean => AppFlowItems.indexOf(step) == AppFlowItems.length - 1;