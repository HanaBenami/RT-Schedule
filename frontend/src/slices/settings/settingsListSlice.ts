import { asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { Setting } from "../../classes/setting";
import settingSerializer from "./settingSerializer";

const sliceName = "settings/fetchList";

export const fetchSettingsList = asyncThunkFactory<Setting>(
    sliceName,
    "/api/settings/list",
    undefined,
    (setting) => settingSerializer.deserialize(setting)
);

export const slice = sliceFactory<Setting>(sliceName, fetchSettingsList);

export default slice.reducer;
