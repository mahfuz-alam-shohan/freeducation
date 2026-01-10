export const adminPageHeaderComponent = `
        const AdminPageHeader = ({ title, subtitle }) => (
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            </header>
        );
`;
