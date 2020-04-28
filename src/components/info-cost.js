import {AbstractComponent} from "./abstractComponent.js";

const createInfoCostTemplate = () => {
  return (`<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p> `);
};

export class InfoCostComponent extends AbstractComponent {
  getTemplate() {
    return createInfoCostTemplate();
  }
}
