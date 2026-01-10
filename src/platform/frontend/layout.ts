import { navBarComponent } from './shared/components/layout/header';
import { adminMobileNavComponent } from './shared/components/layout/admin-mobile-nav';
import { adminPageHeaderComponent } from './shared/components/layout/admin-page-header';
import { adminShellComponent } from './shared/components/layout/admin-shell';
import { adminSidebarComponent } from './shared/components/layout/admin-sidebar';
import { teacherMobileNavComponent } from './shared/components/layout/teacher-mobile-nav';
import { teacherShellComponent } from './shared/components/layout/teacher-shell';
import { teacherSidebarComponent } from './shared/components/layout/teacher-sidebar';
import { uiComponents } from './shared/components/ui';
import { landingComponents } from './modules/public/landing';
import { authComponents } from './modules/public/auth';
import { dashboardComponents } from './modules/admin/dashboard';
import { settingsComponents } from './modules/admin/settings';
import { mainApp } from './modules/app';

export function renderAppHtml(viewName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Freeducation LMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
  <style>
    ${uiComponents}
  </style>
</head>
<body>
  ${navBarComponent}
  ${adminSidebarComponent}
  ${adminMobileNavComponent}
  ${adminShellComponent}
  ${adminPageHeaderComponent}
  ${teacherSidebarComponent}
  ${teacherMobileNavComponent}
  ${teacherShellComponent}
  ${landingComponents}
  ${authComponents}
  ${dashboardComponents}
  ${settingsComponents}
  <script>
    ${mainApp}
  </script>
</body>
</html>`;
}
