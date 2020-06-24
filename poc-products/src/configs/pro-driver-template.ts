// just rename this file from pro-driver-template.ts to pro-driver.ts and put 
// the appropriate Application ID and Endpoint URL values where defined
import { IProdriverConfig } from "models/IProdriverConfig";

export const config: IProdriverConfig = {
  applicationId: "<APPLICATION_ID>",
  productApi: {
    url: '<FULl_URL_TO_PRODUCT_ENDPOINT>' 
  },
};