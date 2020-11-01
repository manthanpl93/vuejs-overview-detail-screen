import Vue from "vue";
import {
    MdButton,
    MdField,
    MdBadge,
    MdIcon,
    MdCheckbox,
    MdProgress,
    MdTooltip,
} from "vue-material/dist/components";

export default function () {
    Vue.use(MdButton);
    Vue.use(MdField);
    Vue.use(MdBadge);
    Vue.use(MdIcon);
    Vue.use(MdCheckbox);
    Vue.use(MdProgress);
    Vue.use(MdTooltip);
}
