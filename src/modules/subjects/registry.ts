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
import { handleBanglaNineTenRoutes } from "./bangla/9-10/routes";
import { handleBanglaElevenTwelveRoutes } from "./bangla/11-12/routes";
import { handleMathematicsRoutes } from "./mathematics/routes";
import { handleHigherMathematicsRoutes } from "./higher-mathematics/routes";
import { defineSubjectModule, type SubjectModule, type SubjectTemplate } from "./types";

const handleBanglaRoutes: SubjectModule["adminRoutes"] = async (request, env, context) => {
  const nineTen = await handleBanglaNineTenRoutes(request, env, context);
  if (nineTen) {
    return nineTen;
  }

  return handleBanglaElevenTwelveRoutes(request, env, context);
};

const subjectModules: SubjectModule[] = [
  defineSubjectModule({ template: banglaTemplate, adminRoutes: handleBanglaRoutes }),
  defineSubjectModule({ template: englishTemplate }),
  defineSubjectModule({ template: mathematicsTemplate, adminRoutes: handleMathematicsRoutes }),
  defineSubjectModule({ template: bangladesh_and_global_studiesTemplate }),
  defineSubjectModule({ template: information_and_communication_technologyTemplate }),
  defineSubjectModule({ template: islam_and_moral_educationTemplate }),
  defineSubjectModule({ template: hindu_religion_and_moral_educationTemplate }),
  defineSubjectModule({ template: buddhist_religion_and_moral_educationTemplate }),
  defineSubjectModule({ template: christian_religion_and_moral_educationTemplate }),
  defineSubjectModule({ template: physicsTemplate }),
  defineSubjectModule({ template: chemistryTemplate }),
  defineSubjectModule({ template: biologyTemplate }),
  defineSubjectModule({ template: higher_mathematicsTemplate, adminRoutes: handleHigherMathematicsRoutes }),
  defineSubjectModule({ template: accountingTemplate }),
  defineSubjectModule({ template: finance_and_bankingTemplate }),
  defineSubjectModule({ template: business_entrepreneurshipTemplate }),
  defineSubjectModule({ template: business_organization_and_managementTemplate }),
  defineSubjectModule({ template: production_management_and_marketingTemplate }),
  defineSubjectModule({ template: finance_banking_and_insuranceTemplate }),
  defineSubjectModule({ template: geography_and_environmentTemplate }),
  defineSubjectModule({ template: civics_and_citizenshipTemplate }),
  defineSubjectModule({ template: economicsTemplate }),
  defineSubjectModule({ template: history_of_bangladesh_and_world_civilizationTemplate }),
  defineSubjectModule({ template: agriculture_studiesTemplate }),
  defineSubjectModule({ template: home_scienceTemplate }),
  defineSubjectModule({ template: civics_and_good_governanceTemplate }),
  defineSubjectModule({ template: historyTemplate }),
  defineSubjectModule({ template: islamic_history_and_cultureTemplate }),
  defineSubjectModule({ template: sociologyTemplate }),
  defineSubjectModule({ template: social_workTemplate }),
  defineSubjectModule({ template: geographyTemplate }),
  defineSubjectModule({ template: logicTemplate }),
  defineSubjectModule({ template: psychologyTemplate }),
  defineSubjectModule({ template: statisticsTemplate }),
];

export const listSubjectModules = (): SubjectModule[] => subjectModules;

export const listSubjectTemplates = (): SubjectTemplate[] =>
  subjectModules.map((subjectModule) => subjectModule.template);

export const getSubjectTemplate = (slug: string | null | undefined): SubjectTemplate | null => {
  if (!slug) {
    return null;
  }

  return subjectModules.find((subjectModule) => subjectModule.template.slug === slug)?.template ?? null;
};

export const getSubjectModule = (slug: string | null | undefined): SubjectModule | null => {
  if (!slug) {
    return null;
  }

  return subjectModules.find((subjectModule) => subjectModule.template.slug === slug) ?? null;
};

export const handleSubjectAdminRoutes = async (
  request: Request,
  env: Parameters<NonNullable<SubjectModule["adminRoutes"]>>[1],
  context: Parameters<NonNullable<SubjectModule["adminRoutes"]>>[2],
): Promise<Response | null> => {
  for (const subjectModule of subjectModules) {
    if (!subjectModule.adminRoutes) {
      continue;
    }

    const response = await subjectModule.adminRoutes(request, env, context);
    if (response) {
      return response;
    }
  }

  return null;
};
