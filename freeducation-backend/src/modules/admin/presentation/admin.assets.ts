import indexHtml from '../../../admin-ui/index.asset.html';
import stylesCss from '../../../admin-ui/styles.asset.css';
import appJs from '../../../admin-ui/app.asset.js';
import layoutJs from '../../../admin-ui/components/layout.asset.js';
import sidebarJs from '../../../admin-ui/components/sidebar.asset.js';
import topbarJs from '../../../admin-ui/components/topbar.asset.js';
import cardsJs from '../../../admin-ui/components/cards.asset.js';
import tableJs from '../../../admin-ui/components/table.asset.js';
import formJs from '../../../admin-ui/components/form.asset.js';
import toastJs from '../../../admin-ui/components/toast.asset.js';
import maintenanceJs from '../../../admin-ui/components/maintenance.asset.js';
import dbJs from '../../../admin-ui/components/db.asset.js';
import apiJs from '../../../admin-ui/components/api.asset.js';

interface AssetEntry {
  body: string;
  contentType: string;
}

const assetMap = new Map<string, AssetEntry>([
  ['/admin', { body: indexHtml, contentType: 'text/html; charset=UTF-8' }],
  ['/admin/', { body: indexHtml, contentType: 'text/html; charset=UTF-8' }],
  ['/admin/assets/styles.css', { body: stylesCss, contentType: 'text/css; charset=UTF-8' }],
  ['/admin/assets/app.js', { body: appJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/layout.js', { body: layoutJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/sidebar.js', { body: sidebarJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/topbar.js', { body: topbarJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/cards.js', { body: cardsJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/table.js', { body: tableJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/form.js', { body: formJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/toast.js', { body: toastJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/maintenance.js', { body: maintenanceJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/db.js', { body: dbJs, contentType: 'application/javascript; charset=UTF-8' }],
  ['/admin/assets/components/api.js', { body: apiJs, contentType: 'application/javascript; charset=UTF-8' }]
]);

export function getAdminAsset(pathname: string): Response | null {
  if (assetMap.has(pathname)) {
    const asset = assetMap.get(pathname)!;
    return new Response(asset.body, {
      status: 200,
      headers: { 'Content-Type': asset.contentType }
    });
  }

  if (pathname.startsWith('/admin/assets/')) {
    return new Response('Not found', { status: 404 });
  }

  if (pathname.startsWith('/admin')) {
    return new Response(indexHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  }

  return null;
}
