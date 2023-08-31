import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { AppDispatch } from "../../store";
import { Setting } from "../../classes/setting";
import settingSerializer from "./settingSerializer";
import { fetchSettingsList } from "./settingsListSlice";

const sliceName = "settings/updateSetting";

export const updateSetting: AppAsyncThunk<Setting, Setting> = asyncThunkFactory<Setting, Setting>(
    sliceName,
    (setting: Setting) => `/api/settings/update/${setting.key}`,
    (setting: Setting) => settingSerializer.serialize(setting, ["value"]),
    (setting) => settingSerializer.deserialize(setting),
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchSettingsList())
);

export const slice = sliceFactory<Setting, Setting>(sliceName, updateSetting);

export default slice.reducer;
