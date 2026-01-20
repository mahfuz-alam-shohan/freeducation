import { banglaTemplate } from "./bangla/definition";
import { englishTemplate } from "./english/definition";
import { mathematicsTemplate } from "./mathematics/definition";
import { bangladesh_and_global_studiesTemplate } from "./bangladesh-and-global-studies/definition";
import { information_and_communication_technologyTemplate } from "./information-and-communication-technology/definition";
import { islam_and_moral_educationTemplate } from "./islam-and-moral-education/definition";
import { hindu_religion_and_moral_educationTemplate } from "./hindu-religion-and-moral-education/definition";
import { buddhist_religion_and_moral_educationTemplate } from "./buddhist-religion-and-moral-education/definition";
import { christian_religion_and_moral_educationTemplate } from "./christian-religion-and-moral-education/definition";
import { physicsTemplate } from "./physics/definition";
import { chemistryTemplate } from "./chemistry/definition";
import { biologyTemplate } from "./biology/definition";
import { higher_mathematicsTemplate } from "./higher-mathematics/definition";
import { accountingTemplate } from "./accounting/definition";
import { finance_and_bankingTemplate } from "./finance-and-banking/definition";
import { business_entrepreneurshipTemplate } from "./business-entrepreneurship/definition";
import { business_organization_and_managementTemplate } from "./business-organization-and-management/definition";
import { production_management_and_marketingTemplate } from "./production-management-and-marketing/definition";
import { finance_banking_and_insuranceTemplate } from "./finance-banking-and-insurance/definition";
import { geography_and_environmentTemplate } from "./geography-and-environment/definition";
import { civics_and_citizenshipTemplate } from "./civics-and-citizenship/definition";
import { economicsTemplate } from "./economics/definition";
import { history_of_bangladesh_and_world_civilizationTemplate } from "./history-of-bangladesh-and-world-civilization/definition";
import { agriculture_studiesTemplate } from "./agriculture-studies/definition";
import { home_scienceTemplate } from "./home-science/definition";
import { civics_and_good_governanceTemplate } from "./civics-and-good-governance/definition";
import { historyTemplate } from "./history/definition";
import { islamic_history_and_cultureTemplate } from "./islamic-history-and-culture/definition";
import { sociologyTemplate } from "./sociology/definition";
import { social_workTemplate } from "./social-work/definition";
import { geographyTemplate } from "./geography/definition";
import { logicTemplate } from "./logic/definition";
import { psychologyTemplate } from "./psychology/definition";
import { statisticsTemplate } from "./statistics/definition";
import type { SubjectTemplate } from "./types";

const subjectTemplates: SubjectTemplate[] = [banglaTemplate, englishTemplate, mathematicsTemplate, bangladesh_and_global_studiesTemplate, information_and_communication_technologyTemplate, islam_and_moral_educationTemplate, hindu_religion_and_moral_educationTemplate, buddhist_religion_and_moral_educationTemplate, christian_religion_and_moral_educationTemplate, physicsTemplate, chemistryTemplate, biologyTemplate, higher_mathematicsTemplate, accountingTemplate, finance_and_bankingTemplate, business_entrepreneurshipTemplate, business_organization_and_managementTemplate, production_management_and_marketingTemplate, finance_banking_and_insuranceTemplate, geography_and_environmentTemplate, civics_and_citizenshipTemplate, economicsTemplate, history_of_bangladesh_and_world_civilizationTemplate, agriculture_studiesTemplate, home_scienceTemplate, civics_and_good_governanceTemplate, historyTemplate, islamic_history_and_cultureTemplate, sociologyTemplate, social_workTemplate, geographyTemplate, logicTemplate, psychologyTemplate, statisticsTemplate];

export const listSubjectTemplates = (): SubjectTemplate[] => subjectTemplates;

export const getSubjectTemplate = (slug: string | null | undefined): SubjectTemplate | null => {
  if (!slug) {
    return null;
  }
  return subjectTemplates.find((template) => template.slug === slug) ?? null;
};
