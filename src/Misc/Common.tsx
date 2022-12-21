export type AppFlow = "setup" | "edit" | "test" | "export";
export const AppFlowItems: AppFlow[] = ["setup", "edit", "test", "export"];
export const AppFlowItemDisplayNames = {
    "setup": "Setup",
    "edit": "Edit",
    "test": "Test",
    "export": "Export"
}

export const isFirstFlowStep = (step: AppFlow): boolean => AppFlowItems.indexOf(step) == 0;
export const isLastFlowStep = (step: AppFlow): boolean => AppFlowItems.indexOf(step) == AppFlowItems.length - 1;