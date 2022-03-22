import { NgModule } from "@angular/core";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faClock, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
    faBalanceScaleRight,
    faBookOpen,
    faCarrot,
    faFlag,
    faPlus,
    faThLarge,
    faTimes,
    faCogs,
    faSearch,
    faPencilAlt,
    faCheck,
    faTrashAlt,
    faFileImport,
    faExclamationTriangle,
    faArrowRightToBracket,

    faArrowLeft,
    faChevronRight,
    faDatabase,
    faSlidersH, faPowerOff, faUser, faCog,
} from "@fortawesome/free-solid-svg-icons";

@NgModule({
    imports: [
        FontAwesomeModule,
    ],
    exports: [
        FontAwesomeModule,
    ]
})
export class IconsModule {

    constructor(library: FaIconLibrary) {
        library.addIcons(
            faClock,
            faBalanceScaleRight,
            faPlus,
            faTimes,
            faBookOpen,
            faCarrot,
            faFlag,
            faThLarge,
            faCogs,
            faCog,
            faSearch,
            faPencilAlt,
            faCheck,
            faTrashAlt,
            faFileImport,
            faExclamationTriangle,
            faArrowRightToBracket,
            faEnvelope,
            faArrowLeft,
            faChevronRight,
            faDatabase,
            faSlidersH,
            faPowerOff,
            faUser,
        );
    }
}
