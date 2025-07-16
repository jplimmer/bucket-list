/** Maximum allowed length for user input fields. */
export const INPUT_MAX_LENGTH = 50;

const iconsRoot = "../assets/icons/";
/** File paths for application assets. */
export const ASSETS_CONFIG = {
  ICONS: {
    BUCKET_LIST: `${iconsRoot}bucketlistlogo.png`,
    SETTINGS_COG: `${iconsRoot}cog_settings.png`,
    CLOSE_CROSS: `${iconsRoot}cross_close.png`,
    ADD_PLUS: `${iconsRoot}bucketlistlogo.png`,
    DELETE_TRASH: `${iconsRoot}trash_delete.png`,
    EYE: `${iconsRoot}eye-icon.svg`,
    EYE_SLASH: `${iconsRoot}eye-slash-icon.svg`,
  },
} as const;
