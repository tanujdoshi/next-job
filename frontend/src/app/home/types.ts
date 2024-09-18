

import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export type JobStepsInformationType = {
    id: number;
    title: string;
    iconName: IconDefinition;
    iconColor: string;
    backgroundColor: string;
    description?: string;
}