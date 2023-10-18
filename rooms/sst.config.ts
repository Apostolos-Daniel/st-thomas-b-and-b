import { SSTConfig } from "sst";
import { API } from "./stacks/RoomsStack";

export default {
  config(_input) {
    return {
      name: "rooms",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API);
  }
} satisfies SSTConfig;
