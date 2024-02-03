import { withInstall } from "@/util";
import { TestDraggable } from "./draggable";
import { App } from "vue";

export const CUzTestDraggable = withInstall(
    TestDraggable,
    function (v: App) {
        v.component(TestDraggable.name, TestDraggable);
        // registerControlProvider(
        // 'GRID_PsscenarioModuleDesign_right',
        // () => new IBizPMDesignRightProvider(),
        // );
    }
)