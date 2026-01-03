export const mainApp = `
        function App() {
            const viewToPath = {
                landing: '/',
                'ssc-subjects': '/ssc',
                'hsc-subjects': '/hsc',
                'public-bangla-ssc-1st-paper': '/ssc/bangla-1st-paper',
                'public-bangla-hsc-1st-paper': '/hsc/bangla-1st-paper',
                'public-bangla-ssc-shahitto': '/ssc/bangla-1st-paper/shahitto',
                'public-bangla-hsc-shahitto': '/hsc/bangla-1st-paper/shahitto',
                'public-bangla-ssc-shohopath': '/ssc/bangla-1st-paper/shohopath',
                'public-bangla-hsc-shohopath': '/hsc/bangla-1st-paper/shohopath',
                'public-bangla-ssc-goddo': '/ssc/bangla-1st-paper/goddo',
                'public-bangla-ssc-poddo': '/ssc/bangla-1st-paper/poddo',
                'public-bangla-hsc-goddo': '/hsc/bangla-1st-paper/goddo',
                'public-bangla-hsc-poddo': '/hsc/bangla-1st-paper/poddo',
                'public-bangla-ssc-item': '/ssc/bangla-1st-paper/item',
                'public-bangla-hsc-item': '/hsc/bangla-1st-paper/item',
                'public-bangla-ssc-srijonshil': '/ssc/bangla-1st-paper/item/srijonshil',
                'public-bangla-hsc-srijonshil': '/hsc/bangla-1st-paper/item/srijonshil',
                'public-bangla-ssc-mcq': '/ssc/bangla-1st-paper/item/mcq',
                'public-bangla-hsc-mcq': '/hsc/bangla-1st-paper/item/mcq',
                'public-ssc-ict': '/ssc/ict',
                'public-ssc-ict-mcq': '/ssc/ict/mcq',
                'public-ssc-physics': '/ssc/physics',
                'public-ssc-physics-topics': '/ssc/physics/topics',
                'public-ssc-physics-topic': '/ssc/physics/topic',
                'public-ssc-physics-cq': '/ssc/physics/cq',
                'public-ssc-physics-mcq': '/ssc/physics/mcq',
                'public-ssc-chemistry': '/ssc/chemistry',
                'public-ssc-chemistry-topics': '/ssc/chemistry/topics',
                'public-ssc-chemistry-topic': '/ssc/chemistry/topic',
                'public-ssc-chemistry-cq': '/ssc/chemistry/cq',
                'public-ssc-chemistry-mcq': '/ssc/chemistry/mcq',
                'public-ssc-biology': '/ssc/biology',
                'public-ssc-biology-topics': '/ssc/biology/topics',
                'public-ssc-biology-topic': '/ssc/biology/topic',
                'public-ssc-biology-cq': '/ssc/biology/cq',
                'public-ssc-biology-mcq': '/ssc/biology/mcq',
                'public-hsc-physics-1st': '/hsc/physics-1st-paper',
                'public-hsc-physics-1st-topics': '/hsc/physics-1st-paper/topics',
                'public-hsc-physics-1st-topic': '/hsc/physics-1st-paper/topic',
                'public-hsc-physics-1st-cq': '/hsc/physics-1st-paper/cq',
                'public-hsc-physics-1st-mcq': '/hsc/physics-1st-paper/mcq',
                'public-hsc-physics-2nd': '/hsc/physics-2nd-paper',
                'public-hsc-physics-2nd-topics': '/hsc/physics-2nd-paper/topics',
                'public-hsc-physics-2nd-topic': '/hsc/physics-2nd-paper/topic',
                'public-hsc-physics-2nd-cq': '/hsc/physics-2nd-paper/cq',
                'public-hsc-physics-2nd-mcq': '/hsc/physics-2nd-paper/mcq',
                'public-hsc-chemistry-1st': '/hsc/chemistry-1st-paper',
                'public-hsc-chemistry-1st-topics': '/hsc/chemistry-1st-paper/topics',
                'public-hsc-chemistry-1st-topic': '/hsc/chemistry-1st-paper/topic',
                'public-hsc-chemistry-1st-cq': '/hsc/chemistry-1st-paper/cq',
                'public-hsc-chemistry-1st-mcq': '/hsc/chemistry-1st-paper/mcq',
                'public-hsc-chemistry-2nd': '/hsc/chemistry-2nd-paper',
                'public-hsc-chemistry-2nd-topics': '/hsc/chemistry-2nd-paper/topics',
                'public-hsc-chemistry-2nd-topic': '/hsc/chemistry-2nd-paper/topic',
                'public-hsc-chemistry-2nd-cq': '/hsc/chemistry-2nd-paper/cq',
                'public-hsc-chemistry-2nd-mcq': '/hsc/chemistry-2nd-paper/mcq',
                'public-hsc-biology-1st': '/hsc/biology-1st-paper',
                'public-hsc-biology-1st-topics': '/hsc/biology-1st-paper/topics',
                'public-hsc-biology-1st-topic': '/hsc/biology-1st-paper/topic',
                'public-hsc-biology-1st-cq': '/hsc/biology-1st-paper/cq',
                'public-hsc-biology-1st-mcq': '/hsc/biology-1st-paper/mcq',
                'public-hsc-biology-2nd': '/hsc/biology-2nd-paper',
                'public-hsc-biology-2nd-topics': '/hsc/biology-2nd-paper/topics',
                'public-hsc-biology-2nd-topic': '/hsc/biology-2nd-paper/topic',
                'public-hsc-biology-2nd-cq': '/hsc/biology-2nd-paper/cq',
                'public-hsc-biology-2nd-mcq': '/hsc/biology-2nd-paper/mcq',
                'public-english-hsc-1st-paper': '/hsc/english-1st-paper',
                'public-english-hsc-reading': '/hsc/english-1st-paper/reading',
                'public-english-hsc-writing': '/hsc/english-1st-paper/writing',
                'public-english-hsc-subtypes': '/hsc/english-1st-paper/subtypes',
                'public-english-hsc-questions': '/hsc/english-1st-paper/questions',
                login: '/login',
                register: '/register',
                dashboard: '/dashboard',
                'admin-groups-ssc': '/dashboard/ssc',
                'admin-groups-hsc': '/dashboard/hsc',
                'admin-ssc-science': '/dashboard/ssc/science',
                'admin-ssc-humanities': '/dashboard/ssc/humanities',
                'admin-ssc-business-studies': '/dashboard/ssc/business-studies',
                'admin-ssc-ict': '/dashboard/ssc/ict',
                'admin-ssc-ict-mcq': '/dashboard/ssc/ict/mcq',
                'admin-ssc-physics': '/dashboard/ssc/physics',
                'admin-ssc-physics-topics': '/dashboard/ssc/physics/topics',
                'admin-ssc-physics-topic': '/dashboard/ssc/physics/topic',
                'admin-ssc-physics-cq-types': '/dashboard/ssc/physics/cq',
                'admin-ssc-physics-cq-questions': '/dashboard/ssc/physics/cq/questions',
                'admin-ssc-physics-mcq': '/dashboard/ssc/physics/mcq',
                'admin-ssc-chemistry': '/dashboard/ssc/chemistry',
                'admin-ssc-chemistry-topics': '/dashboard/ssc/chemistry/topics',
                'admin-ssc-chemistry-topic': '/dashboard/ssc/chemistry/topic',
                'admin-ssc-chemistry-cq-types': '/dashboard/ssc/chemistry/cq',
                'admin-ssc-chemistry-cq-questions': '/dashboard/ssc/chemistry/cq/questions',
                'admin-ssc-chemistry-mcq': '/dashboard/ssc/chemistry/mcq',
                'admin-ssc-biology': '/dashboard/ssc/biology',
                'admin-ssc-biology-topics': '/dashboard/ssc/biology/topics',
                'admin-ssc-biology-topic': '/dashboard/ssc/biology/topic',
                'admin-ssc-biology-cq-types': '/dashboard/ssc/biology/cq',
                'admin-ssc-biology-cq-questions': '/dashboard/ssc/biology/cq/questions',
                'admin-ssc-biology-mcq': '/dashboard/ssc/biology/mcq',
                'admin-hsc-physics-1st': '/dashboard/hsc/physics-1st-paper',
                'admin-hsc-physics-1st-topics': '/dashboard/hsc/physics-1st-paper/topics',
                'admin-hsc-physics-1st-topic': '/dashboard/hsc/physics-1st-paper/topic',
                'admin-hsc-physics-1st-cq-types': '/dashboard/hsc/physics-1st-paper/cq',
                'admin-hsc-physics-1st-cq-questions': '/dashboard/hsc/physics-1st-paper/cq/questions',
                'admin-hsc-physics-1st-mcq': '/dashboard/hsc/physics-1st-paper/mcq',
                'admin-hsc-physics-2nd': '/dashboard/hsc/physics-2nd-paper',
                'admin-hsc-physics-2nd-topics': '/dashboard/hsc/physics-2nd-paper/topics',
                'admin-hsc-physics-2nd-topic': '/dashboard/hsc/physics-2nd-paper/topic',
                'admin-hsc-physics-2nd-cq-types': '/dashboard/hsc/physics-2nd-paper/cq',
                'admin-hsc-physics-2nd-cq-questions': '/dashboard/hsc/physics-2nd-paper/cq/questions',
                'admin-hsc-physics-2nd-mcq': '/dashboard/hsc/physics-2nd-paper/mcq',
                'admin-hsc-chemistry-1st': '/dashboard/hsc/chemistry-1st-paper',
                'admin-hsc-chemistry-1st-topics': '/dashboard/hsc/chemistry-1st-paper/topics',
                'admin-hsc-chemistry-1st-topic': '/dashboard/hsc/chemistry-1st-paper/topic',
                'admin-hsc-chemistry-1st-cq-types': '/dashboard/hsc/chemistry-1st-paper/cq',
                'admin-hsc-chemistry-1st-cq-questions': '/dashboard/hsc/chemistry-1st-paper/cq/questions',
                'admin-hsc-chemistry-1st-mcq': '/dashboard/hsc/chemistry-1st-paper/mcq',
                'admin-hsc-chemistry-2nd': '/dashboard/hsc/chemistry-2nd-paper',
                'admin-hsc-chemistry-2nd-topics': '/dashboard/hsc/chemistry-2nd-paper/topics',
                'admin-hsc-chemistry-2nd-topic': '/dashboard/hsc/chemistry-2nd-paper/topic',
                'admin-hsc-chemistry-2nd-cq-types': '/dashboard/hsc/chemistry-2nd-paper/cq',
                'admin-hsc-chemistry-2nd-cq-questions': '/dashboard/hsc/chemistry-2nd-paper/cq/questions',
                'admin-hsc-chemistry-2nd-mcq': '/dashboard/hsc/chemistry-2nd-paper/mcq',
                'admin-hsc-biology-1st': '/dashboard/hsc/biology-1st-paper',
                'admin-hsc-biology-1st-topics': '/dashboard/hsc/biology-1st-paper/topics',
                'admin-hsc-biology-1st-topic': '/dashboard/hsc/biology-1st-paper/topic',
                'admin-hsc-biology-1st-cq-types': '/dashboard/hsc/biology-1st-paper/cq',
                'admin-hsc-biology-1st-cq-questions': '/dashboard/hsc/biology-1st-paper/cq/questions',
                'admin-hsc-biology-1st-mcq': '/dashboard/hsc/biology-1st-paper/mcq',
                'admin-hsc-biology-2nd': '/dashboard/hsc/biology-2nd-paper',
                'admin-hsc-biology-2nd-topics': '/dashboard/hsc/biology-2nd-paper/topics',
                'admin-hsc-biology-2nd-topic': '/dashboard/hsc/biology-2nd-paper/topic',
                'admin-hsc-biology-2nd-cq-types': '/dashboard/hsc/biology-2nd-paper/cq',
                'admin-hsc-biology-2nd-cq-questions': '/dashboard/hsc/biology-2nd-paper/cq/questions',
                'admin-hsc-biology-2nd-mcq': '/dashboard/hsc/biology-2nd-paper/mcq',
                'admin-hsc-science': '/dashboard/hsc/science',
                'admin-hsc-humanities': '/dashboard/hsc/humanities',
                'admin-hsc-business-studies': '/dashboard/hsc/business-studies',
                'admin-settings': '/dashboard/settings',
                'bangla-ssc-1st-paper': '/dashboard/ssc/bangla-1st-paper',
                'bangla-hsc-1st-paper': '/dashboard/hsc/bangla-1st-paper',
                'bangla-ssc-shahitto': '/dashboard/ssc/bangla-1st-paper/shahitto',
                'bangla-hsc-shahitto': '/dashboard/hsc/bangla-1st-paper/shahitto',
                'bangla-ssc-shohopath': '/dashboard/ssc/bangla-1st-paper/shohopath',
                'bangla-hsc-shohopath': '/dashboard/hsc/bangla-1st-paper/shohopath',
                'bangla-ssc-goddo': '/dashboard/ssc/bangla-1st-paper/goddo',
                'bangla-ssc-poddo': '/dashboard/ssc/bangla-1st-paper/poddo',
                'bangla-hsc-goddo': '/dashboard/hsc/bangla-1st-paper/goddo',
                'bangla-hsc-poddo': '/dashboard/hsc/bangla-1st-paper/poddo',
                'bangla-ssc-item': '/dashboard/ssc/bangla-1st-paper/item',
                'bangla-hsc-item': '/dashboard/hsc/bangla-1st-paper/item',
                'bangla-ssc-srijonshil-types': '/dashboard/ssc/bangla-1st-paper/item/srijonshil',
                'bangla-hsc-srijonshil-types': '/dashboard/hsc/bangla-1st-paper/item/srijonshil',
                'bangla-ssc-srijonshil-questions': '/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions',
                'bangla-hsc-srijonshil-questions': '/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions',
                'bangla-ssc-mcq': '/dashboard/ssc/bangla-1st-paper/item/mcq',
                'bangla-hsc-mcq': '/dashboard/hsc/bangla-1st-paper/item/mcq',
                'english-hsc-1st-paper': '/dashboard/hsc/english-1st-paper',
                'english-hsc-reading': '/dashboard/hsc/english-1st-paper/reading',
                'english-hsc-writing': '/dashboard/hsc/english-1st-paper/writing',
                'english-hsc-subtypes': '/dashboard/hsc/english-1st-paper/subtypes',
                'english-hsc-questions': '/dashboard/hsc/english-1st-paper/questions'
            };
            const getViewFromPath = (path) => {
                if (path.startsWith('/hsc/english-1st-paper/questions')) return 'public-english-hsc-questions';
                if (path.startsWith('/hsc/english-1st-paper/subtypes')) return 'public-english-hsc-subtypes';
                if (path.startsWith('/hsc/english-1st-paper/reading')) return 'public-english-hsc-reading';
                if (path.startsWith('/hsc/english-1st-paper/writing')) return 'public-english-hsc-writing';
                if (path.startsWith('/hsc/english-1st-paper')) return 'public-english-hsc-1st-paper';
                if (path.startsWith('/hsc/physics-1st-paper/mcq')) return 'public-hsc-physics-1st-mcq';
                if (path.startsWith('/hsc/physics-1st-paper/cq')) return 'public-hsc-physics-1st-cq';
                if (path.startsWith('/hsc/physics-1st-paper/topic')) return 'public-hsc-physics-1st-topic';
                if (path.startsWith('/hsc/physics-1st-paper/topics')) return 'public-hsc-physics-1st-topics';
                if (path.startsWith('/hsc/physics-1st-paper')) return 'public-hsc-physics-1st';
                if (path.startsWith('/hsc/physics-2nd-paper/mcq')) return 'public-hsc-physics-2nd-mcq';
                if (path.startsWith('/hsc/physics-2nd-paper/cq')) return 'public-hsc-physics-2nd-cq';
                if (path.startsWith('/hsc/physics-2nd-paper/topic')) return 'public-hsc-physics-2nd-topic';
                if (path.startsWith('/hsc/physics-2nd-paper/topics')) return 'public-hsc-physics-2nd-topics';
                if (path.startsWith('/hsc/physics-2nd-paper')) return 'public-hsc-physics-2nd';
                if (path.startsWith('/hsc/chemistry-1st-paper/mcq')) return 'public-hsc-chemistry-1st-mcq';
                if (path.startsWith('/hsc/chemistry-1st-paper/cq')) return 'public-hsc-chemistry-1st-cq';
                if (path.startsWith('/hsc/chemistry-1st-paper/topic')) return 'public-hsc-chemistry-1st-topic';
                if (path.startsWith('/hsc/chemistry-1st-paper/topics')) return 'public-hsc-chemistry-1st-topics';
                if (path.startsWith('/hsc/chemistry-1st-paper')) return 'public-hsc-chemistry-1st';
                if (path.startsWith('/hsc/chemistry-2nd-paper/mcq')) return 'public-hsc-chemistry-2nd-mcq';
                if (path.startsWith('/hsc/chemistry-2nd-paper/cq')) return 'public-hsc-chemistry-2nd-cq';
                if (path.startsWith('/hsc/chemistry-2nd-paper/topic')) return 'public-hsc-chemistry-2nd-topic';
                if (path.startsWith('/hsc/chemistry-2nd-paper/topics')) return 'public-hsc-chemistry-2nd-topics';
                if (path.startsWith('/hsc/chemistry-2nd-paper')) return 'public-hsc-chemistry-2nd';
                if (path.startsWith('/hsc/biology-1st-paper/mcq')) return 'public-hsc-biology-1st-mcq';
                if (path.startsWith('/hsc/biology-1st-paper/cq')) return 'public-hsc-biology-1st-cq';
                if (path.startsWith('/hsc/biology-1st-paper/topic')) return 'public-hsc-biology-1st-topic';
                if (path.startsWith('/hsc/biology-1st-paper/topics')) return 'public-hsc-biology-1st-topics';
                if (path.startsWith('/hsc/biology-1st-paper')) return 'public-hsc-biology-1st';
                if (path.startsWith('/hsc/biology-2nd-paper/mcq')) return 'public-hsc-biology-2nd-mcq';
                if (path.startsWith('/hsc/biology-2nd-paper/cq')) return 'public-hsc-biology-2nd-cq';
                if (path.startsWith('/hsc/biology-2nd-paper/topic')) return 'public-hsc-biology-2nd-topic';
                if (path.startsWith('/hsc/biology-2nd-paper/topics')) return 'public-hsc-biology-2nd-topics';
                if (path.startsWith('/hsc/biology-2nd-paper')) return 'public-hsc-biology-2nd';
                if (path.startsWith('/ssc/physics/mcq')) return 'public-ssc-physics-mcq';
                if (path.startsWith('/ssc/physics/cq')) return 'public-ssc-physics-cq';
                if (path.startsWith('/ssc/physics/topic')) return 'public-ssc-physics-topic';
                if (path.startsWith('/ssc/physics/topics')) return 'public-ssc-physics-topics';
                if (path.startsWith('/ssc/physics')) return 'public-ssc-physics';
                if (path.startsWith('/ssc/chemistry/mcq')) return 'public-ssc-chemistry-mcq';
                if (path.startsWith('/ssc/chemistry/cq')) return 'public-ssc-chemistry-cq';
                if (path.startsWith('/ssc/chemistry/topic')) return 'public-ssc-chemistry-topic';
                if (path.startsWith('/ssc/chemistry/topics')) return 'public-ssc-chemistry-topics';
                if (path.startsWith('/ssc/chemistry')) return 'public-ssc-chemistry';
                if (path.startsWith('/ssc/biology/mcq')) return 'public-ssc-biology-mcq';
                if (path.startsWith('/ssc/biology/cq')) return 'public-ssc-biology-cq';
                if (path.startsWith('/ssc/biology/topic')) return 'public-ssc-biology-topic';
                if (path.startsWith('/ssc/biology/topics')) return 'public-ssc-biology-topics';
                if (path.startsWith('/ssc/biology')) return 'public-ssc-biology';
                if (path.startsWith('/ssc/ict/mcq')) return 'public-ssc-ict-mcq';
                if (path.startsWith('/ssc/ict')) return 'public-ssc-ict';
                if (path.startsWith('/ssc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-ssc-srijonshil';
                if (path.startsWith('/hsc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-hsc-srijonshil';
                if (path.startsWith('/ssc/bangla-1st-paper/item/mcq')) return 'public-bangla-ssc-mcq';
                if (path.startsWith('/hsc/bangla-1st-paper/item/mcq')) return 'public-bangla-hsc-mcq';
                if (path.startsWith('/ssc/bangla-1st-paper/item')) return 'public-bangla-ssc-item';
                if (path.startsWith('/hsc/bangla-1st-paper/item')) return 'public-bangla-hsc-item';
                if (path.startsWith('/ssc/bangla-1st-paper/goddo')) return 'public-bangla-ssc-goddo';
                if (path.startsWith('/ssc/bangla-1st-paper/poddo')) return 'public-bangla-ssc-poddo';
                if (path.startsWith('/hsc/bangla-1st-paper/goddo')) return 'public-bangla-hsc-goddo';
                if (path.startsWith('/hsc/bangla-1st-paper/poddo')) return 'public-bangla-hsc-poddo';
                if (path.startsWith('/ssc/bangla-1st-paper/shohopath')) return 'public-bangla-ssc-shohopath';
                if (path.startsWith('/hsc/bangla-1st-paper/shohopath')) return 'public-bangla-hsc-shohopath';
                if (path.startsWith('/ssc/bangla-1st-paper/shahitto')) return 'public-bangla-ssc-shahitto';
                if (path.startsWith('/hsc/bangla-1st-paper/shahitto')) return 'public-bangla-hsc-shahitto';
                if (path.startsWith('/ssc/bangla-1st-paper')) return 'public-bangla-ssc-1st-paper';
                if (path.startsWith('/hsc/bangla-1st-paper')) return 'public-bangla-hsc-1st-paper';
                if (path.startsWith('/ssc')) return 'ssc-subjects';
                if (path.startsWith('/hsc')) return 'hsc-subjects';
                if (path.startsWith('/login')) return 'login';
                if (path.startsWith('/register')) return 'register';
                if (path.startsWith('/dashboard/settings')) return 'admin-settings';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/questions')) return 'english-hsc-questions';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/subtypes')) return 'english-hsc-subtypes';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/reading')) return 'english-hsc-reading';
                if (path.startsWith('/dashboard/hsc/english-1st-paper/writing')) return 'english-hsc-writing';
                if (path.startsWith('/dashboard/hsc/english-1st-paper')) return 'english-hsc-1st-paper';
                if (path.startsWith('/dashboard/ssc/ict/mcq')) return 'admin-ssc-ict-mcq';
                if (path.startsWith('/dashboard/ssc/ict')) return 'admin-ssc-ict';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper/cq/questions')) return 'admin-hsc-physics-1st-cq-questions';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper/cq')) return 'admin-hsc-physics-1st-cq-types';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper/mcq')) return 'admin-hsc-physics-1st-mcq';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper/topic')) return 'admin-hsc-physics-1st-topic';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper/topics')) return 'admin-hsc-physics-1st-topics';
                if (path.startsWith('/dashboard/hsc/physics-1st-paper')) return 'admin-hsc-physics-1st';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper/cq/questions')) return 'admin-hsc-physics-2nd-cq-questions';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper/cq')) return 'admin-hsc-physics-2nd-cq-types';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper/mcq')) return 'admin-hsc-physics-2nd-mcq';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper/topic')) return 'admin-hsc-physics-2nd-topic';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper/topics')) return 'admin-hsc-physics-2nd-topics';
                if (path.startsWith('/dashboard/hsc/physics-2nd-paper')) return 'admin-hsc-physics-2nd';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper/cq/questions')) return 'admin-hsc-chemistry-1st-cq-questions';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper/cq')) return 'admin-hsc-chemistry-1st-cq-types';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper/mcq')) return 'admin-hsc-chemistry-1st-mcq';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper/topic')) return 'admin-hsc-chemistry-1st-topic';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper/topics')) return 'admin-hsc-chemistry-1st-topics';
                if (path.startsWith('/dashboard/hsc/chemistry-1st-paper')) return 'admin-hsc-chemistry-1st';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper/cq/questions')) return 'admin-hsc-chemistry-2nd-cq-questions';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper/cq')) return 'admin-hsc-chemistry-2nd-cq-types';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper/mcq')) return 'admin-hsc-chemistry-2nd-mcq';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper/topic')) return 'admin-hsc-chemistry-2nd-topic';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper/topics')) return 'admin-hsc-chemistry-2nd-topics';
                if (path.startsWith('/dashboard/hsc/chemistry-2nd-paper')) return 'admin-hsc-chemistry-2nd';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper/cq/questions')) return 'admin-hsc-biology-1st-cq-questions';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper/cq')) return 'admin-hsc-biology-1st-cq-types';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper/mcq')) return 'admin-hsc-biology-1st-mcq';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper/topic')) return 'admin-hsc-biology-1st-topic';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper/topics')) return 'admin-hsc-biology-1st-topics';
                if (path.startsWith('/dashboard/hsc/biology-1st-paper')) return 'admin-hsc-biology-1st';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper/cq/questions')) return 'admin-hsc-biology-2nd-cq-questions';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper/cq')) return 'admin-hsc-biology-2nd-cq-types';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper/mcq')) return 'admin-hsc-biology-2nd-mcq';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper/topic')) return 'admin-hsc-biology-2nd-topic';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper/topics')) return 'admin-hsc-biology-2nd-topics';
                if (path.startsWith('/dashboard/hsc/biology-2nd-paper')) return 'admin-hsc-biology-2nd';
                if (path.startsWith('/dashboard/ssc/physics/cq/questions')) return 'admin-ssc-physics-cq-questions';
                if (path.startsWith('/dashboard/ssc/physics/cq')) return 'admin-ssc-physics-cq-types';
                if (path.startsWith('/dashboard/ssc/physics/mcq')) return 'admin-ssc-physics-mcq';
                if (path.startsWith('/dashboard/ssc/physics/topic')) return 'admin-ssc-physics-topic';
                if (path.startsWith('/dashboard/ssc/physics/topics')) return 'admin-ssc-physics-topics';
                if (path.startsWith('/dashboard/ssc/physics')) return 'admin-ssc-physics';
                if (path.startsWith('/dashboard/ssc/chemistry/cq/questions')) return 'admin-ssc-chemistry-cq-questions';
                if (path.startsWith('/dashboard/ssc/chemistry/cq')) return 'admin-ssc-chemistry-cq-types';
                if (path.startsWith('/dashboard/ssc/chemistry/mcq')) return 'admin-ssc-chemistry-mcq';
                if (path.startsWith('/dashboard/ssc/chemistry/topic')) return 'admin-ssc-chemistry-topic';
                if (path.startsWith('/dashboard/ssc/chemistry/topics')) return 'admin-ssc-chemistry-topics';
                if (path.startsWith('/dashboard/ssc/chemistry')) return 'admin-ssc-chemistry';
                if (path.startsWith('/dashboard/ssc/biology/cq/questions')) return 'admin-ssc-biology-cq-questions';
                if (path.startsWith('/dashboard/ssc/biology/cq')) return 'admin-ssc-biology-cq-types';
                if (path.startsWith('/dashboard/ssc/biology/mcq')) return 'admin-ssc-biology-mcq';
                if (path.startsWith('/dashboard/ssc/biology/topic')) return 'admin-ssc-biology-topic';
                if (path.startsWith('/dashboard/ssc/biology/topics')) return 'admin-ssc-biology-topics';
                if (path.startsWith('/dashboard/ssc/biology')) return 'admin-ssc-biology';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions')) return 'bangla-ssc-srijonshil-questions';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions')) return 'bangla-hsc-srijonshil-questions';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/srijonshil')) return 'bangla-ssc-srijonshil-types';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/srijonshil')) return 'bangla-hsc-srijonshil-types';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item/mcq')) return 'bangla-ssc-mcq';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item/mcq')) return 'bangla-hsc-mcq';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/item')) return 'bangla-ssc-item';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/item')) return 'bangla-hsc-item';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/goddo')) return 'bangla-ssc-goddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/poddo')) return 'bangla-ssc-poddo';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/natok') || path.startsWith('/dashboard/ssc/bangla-1st-paper/upannyas')) {
                    return 'bangla-ssc-shohopath';
                }
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/goddo')) return 'bangla-hsc-goddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/poddo')) return 'bangla-hsc-poddo';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/natok') || path.startsWith('/dashboard/hsc/bangla-1st-paper/upannyas')) {
                    return 'bangla-hsc-shohopath';
                }
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shohopath')) return 'bangla-ssc-shohopath';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shohopath')) return 'bangla-hsc-shohopath';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper/shahitto')) return 'bangla-ssc-shahitto';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper/shahitto')) return 'bangla-hsc-shahitto';
                if (path.startsWith('/dashboard/ssc/bangla-1st-paper')) return 'bangla-ssc-1st-paper';
                if (path.startsWith('/dashboard/hsc/bangla-1st-paper')) return 'bangla-hsc-1st-paper';
                if (path.startsWith('/dashboard/ssc/science')) return 'admin-ssc-science';
                if (path.startsWith('/dashboard/ssc/humanities')) return 'admin-ssc-humanities';
                if (path.startsWith('/dashboard/ssc/business-studies')) return 'admin-ssc-business-studies';
                if (path.startsWith('/dashboard/hsc/science')) return 'admin-hsc-science';
                if (path.startsWith('/dashboard/hsc/humanities')) return 'admin-hsc-humanities';
                if (path.startsWith('/dashboard/hsc/business-studies')) return 'admin-hsc-business-studies';
                if (path.startsWith('/dashboard/ssc')) return 'admin-groups-ssc';
                if (path.startsWith('/dashboard/hsc')) return 'admin-groups-hsc';
                if (path.startsWith('/dashboard')) return 'dashboard';
                return 'landing';
            };
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [selectedBanglaItem, setSelectedBanglaItem] = useState('');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState('');
            const [selectedSrijonshilType, setSelectedSrijonshilType] = useState(null);
            const [selectedIctChapter, setSelectedIctChapter] = useState(null);
            const [selectedScienceChapter, setSelectedScienceChapter] = useState(null);
            const [selectedScienceTopic, setSelectedScienceTopic] = useState(null);
            const [selectedScienceCqType, setSelectedScienceCqType] = useState(null);
            const [selectedEnglishSection, setSelectedEnglishSection] = useState('');
            const [selectedEnglishType, setSelectedEnglishType] = useState(null);
            const [selectedEnglishSubtype, setSelectedEnglishSubtype] = useState(null);
            const [sscGoddoItems, setSscGoddoItems] = useState([]);
            const [sscPoddoItems, setSscPoddoItems] = useState([]);
            const [hscGoddoItems, setHscGoddoItems] = useState([]);
            const [hscPoddoItems, setHscPoddoItems] = useState([]);
            const [sscShohopathItems, setSscShohopathItems] = useState([]);
            const [hscShohopathItems, setHscShohopathItems] = useState([]);
            const [sscIctChapters, setSscIctChapters] = useState([]);
            const [sscPhysicsChapters, setSscPhysicsChapters] = useState([]);
            const [sscChemistryChapters, setSscChemistryChapters] = useState([]);
            const [sscBiologyChapters, setSscBiologyChapters] = useState([]);
            const [hscPhysics1stChapters, setHscPhysics1stChapters] = useState([]);
            const [hscPhysics2ndChapters, setHscPhysics2ndChapters] = useState([]);
            const [hscChemistry1stChapters, setHscChemistry1stChapters] = useState([]);
            const [hscChemistry2ndChapters, setHscChemistry2ndChapters] = useState([]);
            const [hscBiology1stChapters, setHscBiology1stChapters] = useState([]);
            const [hscBiology2ndChapters, setHscBiology2ndChapters] = useState([]);
            const [srijonshilQuestions, setSrijonshilQuestions] = useState({});
            const [mcqQuestions, setMcqQuestions] = useState({});
            const [englishQuestions, setEnglishQuestions] = useState({});
            const [notesByItem, setNotesByItem] = useState({});
            const [contentLoaded, setContentLoaded] = useState(false);

            const getQuestionKey = (classLabel, categoryName, itemName, extra = '') => {
                return [classLabel, categoryName || 'general', itemName || 'general', extra].join('-');
            };
            const getScienceTopicKey = (chapterId, topicId) => {
                return [chapterId || 'chapter', topicId || 'topic'].join(':');
            };
            const getEnglishQuestionKey = (section, typeKey, subtypeKey) => {
                return ['HSC', section || 'general', typeKey || 'general', subtypeKey || 'general'].join('-');
            };
            const teacherSubjectRoutes = {
                SSC: {
                    'bangla 1st paper': {
                        route: 'bangla-ssc-1st-paper',
                        views: [
                            'bangla-ssc-1st-paper',
                            'bangla-ssc-shahitto',
                            'bangla-ssc-shohopath',
                            'bangla-ssc-goddo',
                            'bangla-ssc-poddo',
                            'bangla-ssc-item',
                            'bangla-ssc-srijonshil-types',
                            'bangla-ssc-srijonshil-questions',
                            'bangla-ssc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'information and communication technology': {
                        route: 'admin-ssc-ict',
                        views: ['admin-ssc-ict', 'admin-ssc-ict-mcq'],
                        description: 'Manage ICT chapters and MCQ uploads.'
                    },
                    physics: {
                        route: 'admin-ssc-physics',
                        views: [
                            'admin-ssc-physics',
                            'admin-ssc-physics-topics',
                            'admin-ssc-physics-topic',
                            'admin-ssc-physics-cq-types',
                            'admin-ssc-physics-cq-questions',
                            'admin-ssc-physics-mcq'
                        ],
                        description: 'Manage SSC Physics chapters, topics, and questions.'
                    },
                    chemistry: {
                        route: 'admin-ssc-chemistry',
                        views: [
                            'admin-ssc-chemistry',
                            'admin-ssc-chemistry-topics',
                            'admin-ssc-chemistry-topic',
                            'admin-ssc-chemistry-cq-types',
                            'admin-ssc-chemistry-cq-questions',
                            'admin-ssc-chemistry-mcq'
                        ],
                        description: 'Manage SSC Chemistry chapters, topics, and questions.'
                    },
                    biology: {
                        route: 'admin-ssc-biology',
                        views: [
                            'admin-ssc-biology',
                            'admin-ssc-biology-topics',
                            'admin-ssc-biology-topic',
                            'admin-ssc-biology-cq-types',
                            'admin-ssc-biology-cq-questions',
                            'admin-ssc-biology-mcq'
                        ],
                        description: 'Manage SSC Biology chapters, topics, and questions.'
                    }
                },
                HSC: {
                    'bangla 1st paper': {
                        route: 'bangla-hsc-1st-paper',
                        views: [
                            'bangla-hsc-1st-paper',
                            'bangla-hsc-shahitto',
                            'bangla-hsc-shohopath',
                            'bangla-hsc-goddo',
                            'bangla-hsc-poddo',
                            'bangla-hsc-item',
                            'bangla-hsc-srijonshil-types',
                            'bangla-hsc-srijonshil-questions',
                            'bangla-hsc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'english 1st paper': {
                        route: 'english-hsc-1st-paper',
                        views: [
                            'english-hsc-1st-paper',
                            'english-hsc-reading',
                            'english-hsc-writing',
                            'english-hsc-subtypes',
                            'english-hsc-questions'
                        ],
                        description: 'Manage English reading and writing question content.'
                    },
                    'physics 1st paper': {
                        route: 'admin-hsc-physics-1st',
                        views: [
                            'admin-hsc-physics-1st',
                            'admin-hsc-physics-1st-topics',
                            'admin-hsc-physics-1st-topic',
                            'admin-hsc-physics-1st-cq-types',
                            'admin-hsc-physics-1st-cq-questions',
                            'admin-hsc-physics-1st-mcq'
                        ],
                        description: 'Manage HSC Physics 1st Paper chapters, topics, and questions.'
                    },
                    'physics 2nd paper': {
                        route: 'admin-hsc-physics-2nd',
                        views: [
                            'admin-hsc-physics-2nd',
                            'admin-hsc-physics-2nd-topics',
                            'admin-hsc-physics-2nd-topic',
                            'admin-hsc-physics-2nd-cq-types',
                            'admin-hsc-physics-2nd-cq-questions',
                            'admin-hsc-physics-2nd-mcq'
                        ],
                        description: 'Manage HSC Physics 2nd Paper chapters, topics, and questions.'
                    },
                    'chemistry 1st paper': {
                        route: 'admin-hsc-chemistry-1st',
                        views: [
                            'admin-hsc-chemistry-1st',
                            'admin-hsc-chemistry-1st-topics',
                            'admin-hsc-chemistry-1st-topic',
                            'admin-hsc-chemistry-1st-cq-types',
                            'admin-hsc-chemistry-1st-cq-questions',
                            'admin-hsc-chemistry-1st-mcq'
                        ],
                        description: 'Manage HSC Chemistry 1st Paper chapters, topics, and questions.'
                    },
                    'chemistry 2nd paper': {
                        route: 'admin-hsc-chemistry-2nd',
                        views: [
                            'admin-hsc-chemistry-2nd',
                            'admin-hsc-chemistry-2nd-topics',
                            'admin-hsc-chemistry-2nd-topic',
                            'admin-hsc-chemistry-2nd-cq-types',
                            'admin-hsc-chemistry-2nd-cq-questions',
                            'admin-hsc-chemistry-2nd-mcq'
                        ],
                        description: 'Manage HSC Chemistry 2nd Paper chapters, topics, and questions.'
                    },
                    'biology 1st paper': {
                        route: 'admin-hsc-biology-1st',
                        views: [
                            'admin-hsc-biology-1st',
                            'admin-hsc-biology-1st-topics',
                            'admin-hsc-biology-1st-topic',
                            'admin-hsc-biology-1st-cq-types',
                            'admin-hsc-biology-1st-cq-questions',
                            'admin-hsc-biology-1st-mcq'
                        ],
                        description: 'Manage HSC Biology 1st Paper chapters, topics, and questions.'
                    },
                    'biology 2nd paper': {
                        route: 'admin-hsc-biology-2nd',
                        views: [
                            'admin-hsc-biology-2nd',
                            'admin-hsc-biology-2nd-topics',
                            'admin-hsc-biology-2nd-topic',
                            'admin-hsc-biology-2nd-cq-types',
                            'admin-hsc-biology-2nd-cq-questions',
                            'admin-hsc-biology-2nd-mcq'
                        ],
                        description: 'Manage HSC Biology 2nd Paper chapters, topics, and questions.'
                    }
                }
            };
            const getTeacherSubjectConfig = (assignment) => {
                if (!assignment) return null;
                const level = String(assignment.level || '').toUpperCase();
                const subjectKey = String(assignment.subject || '').trim().toLowerCase();
                const config = teacherSubjectRoutes[level]?.[subjectKey];
                if (!config) return null;
                return { ...config, level, subject: assignment.subject };
            };
            const getTeacherAllowedViews = (assignment) => {
                const config = getTeacherSubjectConfig(assignment);
                return new Set(['dashboard', 'admin-settings', ...(config?.views || [])]);
            };
            const isDashboardView = (targetView) =>
                targetView === 'dashboard' ||
                targetView === 'admin-settings' ||
                targetView.startsWith('admin-') ||
                targetView.startsWith('bangla-') ||
                targetView.startsWith('english-');

            const defaultContent = {
                sscGoddoItems: [],
                sscPoddoItems: [],
                hscGoddoItems: [],
                hscPoddoItems: [],
                sscShohopathItems: [],
                hscShohopathItems: [],
                sscIctChapters: [],
                sscPhysicsChapters: [],
                sscChemistryChapters: [],
                sscBiologyChapters: [],
                hscPhysics1stChapters: [],
                hscPhysics2ndChapters: [],
                hscChemistry1stChapters: [],
                hscChemistry2ndChapters: [],
                hscBiology1stChapters: [],
                hscBiology2ndChapters: [],
                srijonshilQuestions: {},
                mcqQuestions: {},
                englishQuestions: {},
                notesByItem: {}
            };

            const applyContentState = (content) => {
                const merged = { ...defaultContent, ...(content || {}) };
                setSscGoddoItems(Array.isArray(merged.sscGoddoItems) ? merged.sscGoddoItems : []);
                setSscPoddoItems(Array.isArray(merged.sscPoddoItems) ? merged.sscPoddoItems : []);
                setHscGoddoItems(Array.isArray(merged.hscGoddoItems) ? merged.hscGoddoItems : []);
                setHscPoddoItems(Array.isArray(merged.hscPoddoItems) ? merged.hscPoddoItems : []);
                setSscShohopathItems(Array.isArray(merged.sscShohopathItems) ? merged.sscShohopathItems : []);
                setHscShohopathItems(Array.isArray(merged.hscShohopathItems) ? merged.hscShohopathItems : []);
                setSscIctChapters(Array.isArray(merged.sscIctChapters) ? merged.sscIctChapters : []);
                setSscPhysicsChapters(Array.isArray(merged.sscPhysicsChapters) ? merged.sscPhysicsChapters : []);
                setSscChemistryChapters(Array.isArray(merged.sscChemistryChapters) ? merged.sscChemistryChapters : []);
                setSscBiologyChapters(Array.isArray(merged.sscBiologyChapters) ? merged.sscBiologyChapters : []);
                setHscPhysics1stChapters(Array.isArray(merged.hscPhysics1stChapters) ? merged.hscPhysics1stChapters : []);
                setHscPhysics2ndChapters(Array.isArray(merged.hscPhysics2ndChapters) ? merged.hscPhysics2ndChapters : []);
                setHscChemistry1stChapters(Array.isArray(merged.hscChemistry1stChapters) ? merged.hscChemistry1stChapters : []);
                setHscChemistry2ndChapters(Array.isArray(merged.hscChemistry2ndChapters) ? merged.hscChemistry2ndChapters : []);
                setHscBiology1stChapters(Array.isArray(merged.hscBiology1stChapters) ? merged.hscBiology1stChapters : []);
                setHscBiology2ndChapters(Array.isArray(merged.hscBiology2ndChapters) ? merged.hscBiology2ndChapters : []);
                setSrijonshilQuestions(merged.srijonshilQuestions || {});
                setMcqQuestions(merged.mcqQuestions || {});
                setEnglishQuestions(merged.englishQuestions || {});
                setNotesByItem(merged.notesByItem || {});
            };

            const getBanglaTopics = (classLabel) => [
                {
                    title: 'বাংলা সাহিত্য',
                    description: 'গদ্য ও পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shahitto' : 'public-bangla-hsc-shahitto'
                },
                {
                    title: 'সহপাঠ',
                    description: 'নাটক ও উপন্যাস ভিত্তিক পাঠ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shohopath' : 'public-bangla-hsc-shohopath'
                }
            ];

            const getBanglaShahittoTopics = (classLabel) => [
                {
                    title: 'গদ্য',
                    description: 'গদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-goddo' : 'public-bangla-hsc-goddo'
                },
                {
                    title: 'পদ্য',
                    description: 'পদ্য অধ্যায় সমূহ',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-poddo' : 'public-bangla-hsc-poddo'
                }
            ];


            const englishReadingTypes = [
                {
                    key: 'reading-mcq',
                    label: '1. A. MCQ',
                    description: 'Multiple choice questions based on passages.'
                },
                {
                    key: 'reading-qa',
                    label: '1. B. Question and Answer',
                    description: 'Short answer comprehension questions.'
                },
                {
                    key: 'information-transfer-flow-chart',
                    label: '2. Information Transfer / Flow Chart',
                    description: 'Data or passage-based transfer tasks.',
                    children: [
                        { key: 'information-transfer', label: 'Information Transfer' },
                        { key: 'flow-chart', label: 'Flow Chart' }
                    ]
                },
                {
                    key: 'summarizing',
                    label: '3. Summarizing of a passage',
                    description: 'Summarize the given passage.'
                },
                {
                    key: 'cloze-test-with-clues',
                    label: '4. Cloze test with clues',
                    description: 'Fill in the blanks with guiding clues.'
                },
                {
                    key: 'cloze-test-without-clues',
                    label: '5. Cloze test without clues',
                    description: 'Fill in the blanks without clues.'
                },
                {
                    key: 'rearranging-passage',
                    label: '6. Rearranging the passage',
                    description: 'Arrange jumbled sentences into the correct order.'
                }
            ];

            const englishWritingTypes = [
                {
                    key: 'writing-paragraph',
                    label: '7. Writing paragraph',
                    description: 'Write a focused paragraph on a topic.'
                },
                {
                    key: 'completing-story',
                    label: '8. Completing a story',
                    description: 'Finish a story with a logical ending.'
                },
                {
                    key: 'informal-letters-emails',
                    label: '9. Informal letters / Emails',
                    description: 'Personal letters and email writing.',
                    children: [
                        { key: 'informal-letters', label: 'Informal letters' },
                        { key: 'emails', label: 'Emails' }
                    ]
                },
                {
                    key: 'analyzing-maps-graphs-charts',
                    label: '10. Analyzing maps / Graphs / Charts',
                    description: 'Describe and analyze visual data.',
                    children: [
                        { key: 'maps', label: 'Analyzing maps' },
                        { key: 'graphs', label: 'Analyzing graphs' },
                        { key: 'charts', label: 'Analyzing charts' }
                    ]
                },
                {
                    key: 'theme-writing',
                    label: '11. Theme writing',
                    description: 'Write on a theme or idea.'
                }
            ];

            const englishQuestionKey = getEnglishQuestionKey(
                selectedEnglishSection,
                selectedEnglishType?.key,
                selectedEnglishSubtype?.key
            );
            const englishQuestionEntries = englishQuestions[englishQuestionKey] || [];
            const englishQuestionTitle = selectedEnglishSubtype
                ? (selectedEnglishType?.label || '') + ' • ' + selectedEnglishSubtype.label
                : selectedEnglishType?.label || 'English 1st Paper';
            const englishQuestionSubtitle = selectedEnglishSection
                ? selectedEnglishSection + ' section questions'
                : 'English 1st Paper questions';

            const activeScienceTopicKey = getScienceTopicKey(selectedScienceChapter?.id, selectedScienceTopic?.id);

            const addQuestionEntry = (setter, key) => (entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.push(entry);
                    return { ...prev, [key]: updated };
                });
            };

            const updateQuestionEntry = (setter, key) => (index, entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated[index] = entry;
                    return { ...prev, [key]: updated };
                });
            };

            const removeQuestionEntry = (setter, key) => (index) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.splice(index, 1);
                    return { ...prev, [key]: updated };
                });
            };

            const addStringItem = (setItems) => (value) => {
                setItems((prev) => [...prev, value]);
            };

            const updateStringItem = (setItems) => (prevValue, nextValue) => {
                setItems((prev) => prev.map((item) => (item === prevValue ? nextValue : item)));
            };

            const removeStringItem = (setItems) => (value) => {
                setItems((prev) => prev.filter((item) => item !== value));
            };

            const addShohopathItem = (setItems) => (nextItem) => {
                setItems((prev) => [...prev, nextItem]);
            };

            const updateShohopathItem = (setItems) => (itemId, updates) => {
                setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
            };

            const removeShohopathItem = (setItems) => (itemId) => {
                setItems((prev) => prev.filter((item) => item.id !== itemId));
            };

            const addChapterItem = (setItems) => (entry) => {
                setItems((prev) => [...prev, entry]);
            };

            const updateChapterItem = (setItems) => (chapterId, name) => {
                setItems((prev) => prev.map((item) => (item.id === chapterId ? { ...item, name } : item)));
            };

            const removeChapterItem = (setItems) => (chapterId) => {
                setItems((prev) => prev.filter((item) => item.id !== chapterId));
            };

            const addTopicItem = (setItems) => (chapterId, topic) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: [...(chapter.topics || []), topic] }
                            : chapter
                    )
                );
            };

            const updateTopicItem = (setItems) => (chapterId, topicId, name) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId ? { ...topic, name } : topic
                                )
                            }
                            : chapter
                    )
                );
            };

            const removeTopicItem = (setItems) => (chapterId, topicId) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: (chapter.topics || []).filter((topic) => topic.id !== topicId) }
                            : chapter
                    )
                );
            };

            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false } = options;
                setView(nextView);
                const nextPath = viewToPath[nextView] || '/';
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
            };

            useEffect(() => {
                const handlePopState = () => {
                    syncRoutesFromLocation();
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);

            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    // A. Check Setup Status
                    await fetch('/api/init', { method: 'POST' });
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);

                    // B. Try to Restore Session
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        try {
                            const meRes = await fetch('/api/me', {
                                headers: { 'Authorization': 'Bearer ' + token }
                            });
                            const meData = await meRes.json();
                            if (meData.user) {
                                setUser(meData.user);
                            } else {
                                // Invalid token
                                localStorage.removeItem('auth_token');
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                        }
                    }

                    if (data.hasAdmin && view === 'register') {
                        navigate('login', { replace: true });
                    }
                    if (!data.hasAdmin && view === 'login') {
                        navigate('register', { replace: true });
                    }
                    if (!token && isDashboardView(view)) {
                        navigate('landing', { replace: true });
                    }
                    setIsLoading(false);
                };
                initSystem();
            }, []);

            useEffect(() => {
                const loadContent = async () => {
                    try {
                        const response = await fetch('/api/content');
                        const data = await response.json();
                        if (data.success && data.content) {
                            applyContentState(data.content);
                        }
                    } catch (e) {
                        console.warn('Failed to load content', e);
                    } finally {
                        setContentLoaded(true);
                    }
                };
                loadContent();
            }, []);

            useEffect(() => {
                if (!contentLoaded) return;
                if (!user) return;
                const canEditContent = user.role === 'admin' || (user.role === 'teacher' && user.assignment);
                if (!canEditContent) return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const payload = {
                    sscGoddoItems,
                    sscPoddoItems,
                    hscGoddoItems,
                    hscPoddoItems,
                    sscShohopathItems,
                    hscShohopathItems,
                    sscIctChapters,
                    sscPhysicsChapters,
                    sscChemistryChapters,
                    sscBiologyChapters,
                    hscPhysics1stChapters,
                    hscPhysics2ndChapters,
                    hscChemistry1stChapters,
                    hscChemistry2ndChapters,
                    hscBiology1stChapters,
                    hscBiology2ndChapters,
                    srijonshilQuestions,
                    mcqQuestions,
                    englishQuestions,
                    notesByItem
                };

                const timeout = setTimeout(async () => {
                    try {
                        await fetch('/api/content', {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                    } catch (e) {
                        console.warn('Failed to save content', e);
                    }
                }, 600);

                return () => clearTimeout(timeout);
            }, [
                contentLoaded,
                user,
                sscGoddoItems,
                sscPoddoItems,
                hscGoddoItems,
                hscPoddoItems,
                sscShohopathItems,
                hscShohopathItems,
                sscIctChapters,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                srijonshilQuestions,
                mcqQuestions,
                englishQuestions,
                notesByItem
            ]);

            const handleLogin = async (username, password) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    // SAVE TOKEN!
                    localStorage.setItem('auth_token', data.token);
                    setUser({
                        username: data.username,
                        role: data.role,
                        permissions: data.permissions || [],
                        assignment: data.assignment || null
                    });
                    navigate('dashboard');
                } else {
                    alert(data.error);
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                navigate('landing');
            };

            const handleRegister = async (username, password) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Account created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };

            useEffect(() => {
                if (!user || user.role !== 'teacher') return;
                const allowedViews = getTeacherAllowedViews(user.assignment);
                if (isDashboardView(view) && !allowedViews.has(view)) {
                    navigate('dashboard', { replace: true });
                }
            }, [user, view]);

            if (isLoading || hasAdmin === null) return <Loading />;
            const teacherSubjectConfig = getTeacherSubjectConfig(user?.assignment);

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} onLogout={handleLogout} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        {view === 'landing' && <StudentLanding onNavigate={navigate} />}
                        {view === 'ssc-subjects' && (
                            <SubjectIndexPage classLabel="SSC" subjects={sscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'hsc-subjects' && (
                            <SubjectIndexPage classLabel="HSC" subjects={hscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'public-ssc-ict' && (
                            <PublicIctShell
                                title="আইসিটি অধ্যায়সমূহ"
                                subtitle="SSC আইসিটির অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicIctChapterList
                                    chapters={sscIctChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedIctChapter(chapter);
                                        navigate('public-ssc-ict-mcq');
                                    }}
                                />
                            </PublicIctShell>
                        )}
                        {view === 'public-ssc-ict-mcq' && (
                            <PublicIctMcqDetail
                                chapter={selectedIctChapter}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onBack={() => navigate('public-ssc-ict')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-physics' && (
                            <PublicScienceShell
                                subjectLabel="Physics"
                                classLabel="SSC"
                                title="Physics অধ্যায়সমূহ"
                                subtitle="SSC Physics এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="SSC"
                                    subjectLabel="Physics"
                                    chapters={sscPhysicsChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-ssc-physics-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-physics-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics"
                                classLabel="SSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-ssc-physics')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-ssc-physics-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-physics-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-ssc-physics-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-ssc-physics-cq')}
                                onNavigateMcq={() => navigate('public-ssc-physics-mcq')}
                            />
                        )}
                        {view === 'public-ssc-physics-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                onBack={() => navigate('public-ssc-physics-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-physics-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-physics-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-chemistry' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                title="Chemistry অধ্যায়সমূহ"
                                subtitle="SSC Chemistry এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="SSC"
                                    subjectLabel="Chemistry"
                                    chapters={sscChemistryChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-ssc-chemistry-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-chemistry-topics' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-ssc-chemistry')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-ssc-chemistry-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-chemistry-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-ssc-chemistry-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-ssc-chemistry-cq')}
                                onNavigateMcq={() => navigate('public-ssc-chemistry-mcq')}
                            />
                        )}
                        {view === 'public-ssc-chemistry-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                onBack={() => navigate('public-ssc-chemistry-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-chemistry-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-chemistry-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-biology' && (
                            <PublicScienceShell
                                subjectLabel="Biology"
                                classLabel="SSC"
                                title="Biology অধ্যায়সমূহ"
                                subtitle="SSC Biology এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="SSC"
                                    subjectLabel="Biology"
                                    chapters={sscBiologyChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-ssc-biology-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-biology-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology"
                                classLabel="SSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-ssc-biology')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-ssc-biology-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-biology-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-ssc-biology-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-ssc-biology-cq')}
                                onNavigateMcq={() => navigate('public-ssc-biology-mcq')}
                            />
                        )}
                        {view === 'public-ssc-biology-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                onBack={() => navigate('public-ssc-biology-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-biology-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-biology-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-1st' && (
                            <PublicScienceShell
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                title="Physics 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Physics 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Physics 1st Paper"
                                    chapters={hscPhysics1stChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-physics-1st-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-1st-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-physics-1st')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-physics-1st-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-1st-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-physics-1st-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-physics-1st-cq')}
                                onNavigateMcq={() => navigate('public-hsc-physics-1st-mcq')}
                            />
                        )}
                        {view === 'public-hsc-physics-1st-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-physics-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-1st-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                title="Physics 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Physics 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Physics 2nd Paper"
                                    chapters={hscPhysics2ndChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-physics-2nd-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-2nd-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-physics-2nd')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-physics-2nd-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-2nd-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-physics-2nd-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-physics-2nd-cq')}
                                onNavigateMcq={() => navigate('public-hsc-physics-2nd-mcq')}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-physics-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-1st' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                title="Chemistry 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Chemistry 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Chemistry 1st Paper"
                                    chapters={hscChemistry1stChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-chemistry-1st-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-chemistry-1st-topics' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-chemistry-1st')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-chemistry-1st-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-chemistry-1st-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-chemistry-1st-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-chemistry-1st-cq')}
                                onNavigateMcq={() => navigate('public-hsc-chemistry-1st-mcq')}
                            />
                        )}
                        {view === 'public-hsc-chemistry-1st-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-chemistry-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-1st-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-chemistry-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                title="Chemistry 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Chemistry 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Chemistry 2nd Paper"
                                    chapters={hscChemistry2ndChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-chemistry-2nd-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-chemistry-2nd-topics' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-chemistry-2nd')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-chemistry-2nd-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-chemistry-2nd-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-chemistry-2nd-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-chemistry-2nd-cq')}
                                onNavigateMcq={() => navigate('public-hsc-chemistry-2nd-mcq')}
                            />
                        )}
                        {view === 'public-hsc-chemistry-2nd-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-2nd-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-1st' && (
                            <PublicScienceShell
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                title="Biology 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Biology 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Biology 1st Paper"
                                    chapters={hscBiology1stChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-biology-1st-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-1st-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-biology-1st')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-biology-1st-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-1st-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-biology-1st-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-biology-1st-cq')}
                                onNavigateMcq={() => navigate('public-hsc-biology-1st-mcq')}
                            />
                        )}
                        {view === 'public-hsc-biology-1st-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-biology-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-1st-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                title="Biology 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Biology 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Biology 2nd Paper"
                                    chapters={hscBiology2ndChapters}
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-biology-2nd-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-2nd-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-biology-2nd')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-biology-2nd-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-2nd-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onBack={() => navigate('public-hsc-biology-2nd-topics')}
                                onNavigate={navigate}
                                onNavigateCq={() => navigate('public-hsc-biology-2nd-cq')}
                                onNavigateMcq={() => navigate('public-hsc-biology-2nd-mcq')}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-biology-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="SSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaTopics('SSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="HSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaTopics('HSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaShahittoTopics('SSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid topics={getBanglaShahittoTopics('HSC')} onNavigate={navigate} />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="SSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="গদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="SSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="পদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="HSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="গদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="HSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="পদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="SSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    items={sscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="HSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    items={hscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-english-hsc-1st-paper' && (
                            <PublicEnglishShell
                                title="English 1st Paper"
                                subtitle="Select Reading or Writing to explore HSC English 1st Paper."
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishCardGrid
                                    items={[
                                        {
                                            key: 'reading',
                                            title: 'Reading',
                                            description: 'MCQ, comprehension, and passage-based tasks.',
                                            route: 'public-english-hsc-reading'
                                        },
                                        {
                                            key: 'writing',
                                            title: 'Writing',
                                            description: 'Paragraphs, stories, letters, and analysis tasks.',
                                            route: 'public-english-hsc-writing'
                                        }
                                    ]}
                                    onNavigate={navigate}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-reading' && (
                            <PublicEnglishShell
                                title="Reading"
                                subtitle="Choose a question type from the reading section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishReadingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Reading');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-writing' && (
                            <PublicEnglishShell
                                title="Writing"
                                subtitle="Choose a question type from the writing section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishWritingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Writing');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-subtypes' && (
                            <PublicEnglishShell
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Select a specific option to view questions."
                                onBack={() =>
                                    navigate(
                                        selectedEnglishSection === 'Writing'
                                            ? 'public-english-hsc-writing'
                                            : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={selectedEnglishType?.children || []}
                                    onSelect={(child) => {
                                        setSelectedEnglishSubtype(child);
                                        navigate('public-english-hsc-questions');
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-questions' && (
                            <PublicEnglishShell
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'public-english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'public-english-hsc-writing'
                                                : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishQuestionList questions={englishQuestionEntries} />
                            </PublicEnglishShell>
                        )}
                        {view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'dashboard' && user?.role === 'teacher' && (
                            <TeacherDashboard assignment={user.assignment} subjectConfig={teacherSubjectConfig} onNavigate={navigate} />
                        )}
                        {view === 'dashboard' && (!user || user.role !== 'teacher') && (
                            <AdminDashboard onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-ssc' && (
                            <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-hsc' && (
                            <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-science' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-humanities' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-business-studies' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-ict' && (
                            <IctChapterList
                                chapters={sscIctChapters}
                                onAdd={addChapterItem(setSscIctChapters)}
                                onUpdate={updateChapterItem(setSscIctChapters)}
                                onDelete={removeChapterItem(setSscIctChapters)}
                                onSelect={(chapter) => {
                                    setSelectedIctChapter(chapter);
                                    navigate('admin-ssc-ict-mcq');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-ict-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedIctChapter?.name || 'নির্বাচিত অধ্যায়'}
                                questions={mcqQuestions[getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                itemRoute="admin-ssc-ict"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics' && (
                            <ScienceChapterList
                                classLabel="SSC"
                                subjectLabel="Physics"
                                chapters={sscPhysicsChapters}
                                onAdd={addChapterItem(setSscPhysicsChapters)}
                                onUpdate={updateChapterItem(setSscPhysicsChapters)}
                                onDelete={removeChapterItem(setSscPhysicsChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-physics-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics-topics' && (
                            <ScienceTopicList
                                classLabel="SSC"
                                subjectLabel="Physics"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setSscPhysicsChapters)}
                                onUpdateTopic={updateTopicItem(setSscPhysicsChapters)}
                                onDeleteTopic={removeTopicItem(setSscPhysicsChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-ssc-physics-topic');
                                }}
                                onBack={() => navigate('admin-ssc-physics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics-topic' && (
                            <ScienceTopicDetail
                                classLabel="SSC"
                                subjectLabel="Physics"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-ssc-physics-topics')}
                                onNavigateCq={() => navigate('admin-ssc-physics-cq-types')}
                                onNavigateMcq={() => navigate('admin-ssc-physics-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-ssc-physics-topic"
                                questionRoute="admin-ssc-physics-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-ssc-physics-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-physics-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
                                itemRoute="admin-ssc-physics-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry' && (
                            <ScienceChapterList
                                classLabel="SSC"
                                subjectLabel="Chemistry"
                                chapters={sscChemistryChapters}
                                onAdd={addChapterItem(setSscChemistryChapters)}
                                onUpdate={updateChapterItem(setSscChemistryChapters)}
                                onDelete={removeChapterItem(setSscChemistryChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-chemistry-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry-topics' && (
                            <ScienceTopicList
                                classLabel="SSC"
                                subjectLabel="Chemistry"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setSscChemistryChapters)}
                                onUpdateTopic={updateTopicItem(setSscChemistryChapters)}
                                onDeleteTopic={removeTopicItem(setSscChemistryChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-ssc-chemistry-topic');
                                }}
                                onBack={() => navigate('admin-ssc-chemistry')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry-topic' && (
                            <ScienceTopicDetail
                                classLabel="SSC"
                                subjectLabel="Chemistry"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-ssc-chemistry-topics')}
                                onNavigateCq={() => navigate('admin-ssc-chemistry-cq-types')}
                                onNavigateMcq={() => navigate('admin-ssc-chemistry-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-ssc-chemistry-topic"
                                questionRoute="admin-ssc-chemistry-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-ssc-chemistry-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-chemistry-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-ssc-chemistry-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology' && (
                            <ScienceChapterList
                                classLabel="SSC"
                                subjectLabel="Biology"
                                chapters={sscBiologyChapters}
                                onAdd={addChapterItem(setSscBiologyChapters)}
                                onUpdate={updateChapterItem(setSscBiologyChapters)}
                                onDelete={removeChapterItem(setSscBiologyChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-biology-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology-topics' && (
                            <ScienceTopicList
                                classLabel="SSC"
                                subjectLabel="Biology"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setSscBiologyChapters)}
                                onUpdateTopic={updateTopicItem(setSscBiologyChapters)}
                                onDeleteTopic={removeTopicItem(setSscBiologyChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-ssc-biology-topic');
                                }}
                                onBack={() => navigate('admin-ssc-biology')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology-topic' && (
                            <ScienceTopicDetail
                                classLabel="SSC"
                                subjectLabel="Biology"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-ssc-biology-topics')}
                                onNavigateCq={() => navigate('admin-ssc-biology-cq-types')}
                                onNavigateMcq={() => navigate('admin-ssc-biology-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-ssc-biology-topic"
                                questionRoute="admin-ssc-biology-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-ssc-biology-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-biology-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-ssc-biology-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Physics 1st Paper"
                                chapters={hscPhysics1stChapters}
                                onAdd={addChapterItem(setHscPhysics1stChapters)}
                                onUpdate={updateChapterItem(setHscPhysics1stChapters)}
                                onDelete={removeChapterItem(setHscPhysics1stChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-physics-1st-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Physics 1st Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscPhysics1stChapters)}
                                onUpdateTopic={updateTopicItem(setHscPhysics1stChapters)}
                                onDeleteTopic={removeTopicItem(setHscPhysics1stChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-physics-1st-topic');
                                }}
                                onBack={() => navigate('admin-hsc-physics-1st')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Physics 1st Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-physics-1st-topics')}
                                onNavigateCq={() => navigate('admin-hsc-physics-1st-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-physics-1st-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-physics-1st-topic"
                                questionRoute="admin-hsc-physics-1st-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-physics-1st-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-1st-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-physics-1st-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Physics 2nd Paper"
                                chapters={hscPhysics2ndChapters}
                                onAdd={addChapterItem(setHscPhysics2ndChapters)}
                                onUpdate={updateChapterItem(setHscPhysics2ndChapters)}
                                onDelete={removeChapterItem(setHscPhysics2ndChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-physics-2nd-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Physics 2nd Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscPhysics2ndChapters)}
                                onUpdateTopic={updateTopicItem(setHscPhysics2ndChapters)}
                                onDeleteTopic={removeTopicItem(setHscPhysics2ndChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-physics-2nd-topic');
                                }}
                                onBack={() => navigate('admin-hsc-physics-2nd')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Physics 2nd Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-physics-2nd-topics')}
                                onNavigateCq={() => navigate('admin-hsc-physics-2nd-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-physics-2nd-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-physics-2nd-topic"
                                questionRoute="admin-hsc-physics-2nd-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-physics-2nd-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-physics-2nd-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-physics-2nd-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Chemistry 1st Paper"
                                chapters={hscChemistry1stChapters}
                                onAdd={addChapterItem(setHscChemistry1stChapters)}
                                onUpdate={updateChapterItem(setHscChemistry1stChapters)}
                                onDelete={removeChapterItem(setHscChemistry1stChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-chemistry-1st-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Chemistry 1st Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscChemistry1stChapters)}
                                onUpdateTopic={updateTopicItem(setHscChemistry1stChapters)}
                                onDeleteTopic={removeTopicItem(setHscChemistry1stChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-chemistry-1st-topic');
                                }}
                                onBack={() => navigate('admin-hsc-chemistry-1st')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Chemistry 1st Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-chemistry-1st-topics')}
                                onNavigateCq={() => navigate('admin-hsc-chemistry-1st-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-chemistry-1st-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-chemistry-1st-topic"
                                questionRoute="admin-hsc-chemistry-1st-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-chemistry-1st-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-1st-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-chemistry-1st-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Chemistry 2nd Paper"
                                chapters={hscChemistry2ndChapters}
                                onAdd={addChapterItem(setHscChemistry2ndChapters)}
                                onUpdate={updateChapterItem(setHscChemistry2ndChapters)}
                                onDelete={removeChapterItem(setHscChemistry2ndChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-chemistry-2nd-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Chemistry 2nd Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscChemistry2ndChapters)}
                                onUpdateTopic={updateTopicItem(setHscChemistry2ndChapters)}
                                onDeleteTopic={removeTopicItem(setHscChemistry2ndChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-chemistry-2nd-topic');
                                }}
                                onBack={() => navigate('admin-hsc-chemistry-2nd')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Chemistry 2nd Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-chemistry-2nd-topics')}
                                onNavigateCq={() => navigate('admin-hsc-chemistry-2nd-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-chemistry-2nd-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-chemistry-2nd-topic"
                                questionRoute="admin-hsc-chemistry-2nd-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-chemistry-2nd-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-chemistry-2nd-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-chemistry-2nd-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Biology 1st Paper"
                                chapters={hscBiology1stChapters}
                                onAdd={addChapterItem(setHscBiology1stChapters)}
                                onUpdate={updateChapterItem(setHscBiology1stChapters)}
                                onDelete={removeChapterItem(setHscBiology1stChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-biology-1st-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Biology 1st Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscBiology1stChapters)}
                                onUpdateTopic={updateTopicItem(setHscBiology1stChapters)}
                                onDeleteTopic={removeTopicItem(setHscBiology1stChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-biology-1st-topic');
                                }}
                                onBack={() => navigate('admin-hsc-biology-1st')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Biology 1st Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-biology-1st-topics')}
                                onNavigateCq={() => navigate('admin-hsc-biology-1st-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-biology-1st-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-biology-1st-topic"
                                questionRoute="admin-hsc-biology-1st-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-biology-1st-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-1st-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-biology-1st-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd' && (
                            <ScienceChapterList
                                classLabel="HSC"
                                subjectLabel="Biology 2nd Paper"
                                chapters={hscBiology2ndChapters}
                                onAdd={addChapterItem(setHscBiology2ndChapters)}
                                onUpdate={updateChapterItem(setHscBiology2ndChapters)}
                                onDelete={removeChapterItem(setHscBiology2ndChapters)}
                                onSelect={(chapter) => {
                                    setSelectedScienceChapter(chapter);
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-biology-2nd-topics');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd-topics' && (
                            <ScienceTopicList
                                classLabel="HSC"
                                subjectLabel="Biology 2nd Paper"
                                chapter={selectedScienceChapter}
                                onAddTopic={addTopicItem(setHscBiology2ndChapters)}
                                onUpdateTopic={updateTopicItem(setHscBiology2ndChapters)}
                                onDeleteTopic={removeTopicItem(setHscBiology2ndChapters)}
                                onSelectTopic={(topic) => {
                                    setSelectedScienceTopic(topic);
                                    navigate('admin-hsc-biology-2nd-topic');
                                }}
                                onBack={() => navigate('admin-hsc-biology-2nd')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd-topic' && (
                            <ScienceTopicDetail
                                classLabel="HSC"
                                subjectLabel="Biology 2nd Paper"
                                chapter={selectedScienceChapter}
                                topic={selectedScienceTopic}
                                noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onBack={() => navigate('admin-hsc-biology-2nd-topics')}
                                onNavigateCq={() => navigate('admin-hsc-biology-2nd-cq-types')}
                                onNavigateMcq={() => navigate('admin-hsc-biology-2nd-mcq')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd-cq-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                itemRoute="admin-hsc-biology-2nd-topic"
                                questionRoute="admin-hsc-biology-2nd-cq-questions"
                                title="CQ প্রশ্ন"
                                subtitle={`${selectedScienceTopic?.name || 'নির্বাচিত টপিক'} এর প্রশ্নের ধরন নির্বাচন করুন।`}
                                onSelectType={(type) => setSelectedScienceCqType(type)}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd-cq-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
                                questions={
                                    srijonshilQuestions[
                                        getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                    ] || []
                                }
                                onAdd={addQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onUpdate={updateQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                onDelete={removeQuestionEntry(
                                    setSrijonshilQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                                )}
                                typeRoute="admin-hsc-biology-2nd-cq-types"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-biology-2nd-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
                                questions={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onAdd={addQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onUpdate={updateQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                onDelete={removeQuestionEntry(
                                    setMcqQuestions,
                                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
                                )}
                                itemRoute="admin-hsc-biology-2nd-topic"
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-hsc-science' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-humanities' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-business-studies' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-1st-paper' && (
                            <EnglishFirstPaperHome classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-reading' && (
                            <EnglishSectionList
                                title="Reading"
                                subtitle="Select a reading question type."
                                items={englishReadingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Reading');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-writing' && (
                            <EnglishSectionList
                                title="Writing"
                                subtitle="Select a writing question type."
                                items={englishWritingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Writing');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-subtypes' && (
                            <EnglishSectionList
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Choose a specific question variation."
                                items={selectedEnglishType?.children || []}
                                onBack={() =>
                                    navigate(selectedEnglishSection === 'Writing' ? 'english-hsc-writing' : 'english-hsc-reading')
                                }
                                onSelect={(child) => {
                                    setSelectedEnglishSubtype(child);
                                    navigate('english-hsc-questions');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-questions' && (
                            <EnglishQuestionList
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                questions={englishQuestionEntries}
                                onAdd={addQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onUpdate={updateQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onDelete={removeQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'english-hsc-writing'
                                                : 'english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shahitto' && (
                            <BanglaShahitto classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-shahitto' && (
                            <BanglaShahitto classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shohopath' && (
                            <BanglaShohopath
                                classLabel="SSC"
                                items={sscShohopathItems}
                                onAddItem={addShohopathItem(setSscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setSscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setSscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-shohopath' && (
                            <BanglaShohopath
                                classLabel="HSC"
                                items={hscShohopathItems}
                                onAddItem={addShohopathItem(setHscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setHscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setHscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-goddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="গদ্য"
                                items={sscGoddoItems}
                                onAddItem={addStringItem(setSscGoddoItems)}
                                onUpdateItem={updateStringItem(setSscGoddoItems)}
                                onRemoveItem={removeStringItem(setSscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-poddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="পদ্য"
                                items={sscPoddoItems}
                                onAddItem={addStringItem(setSscPoddoItems)}
                                onUpdateItem={updateStringItem(setSscPoddoItems)}
                                onRemoveItem={removeStringItem(setSscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-goddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="গদ্য"
                                items={hscGoddoItems}
                                onAddItem={addStringItem(setHscGoddoItems)}
                                onUpdateItem={updateStringItem(setHscGoddoItems)}
                                onRemoveItem={removeStringItem(setHscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-poddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="পদ্য"
                                items={hscPoddoItems}
                                onAddItem={addStringItem(setHscPoddoItems)}
                                onUpdateItem={updateStringItem(setHscPoddoItems)}
                                onRemoveItem={removeStringItem(setHscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-item' && (
                            <BanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-item' && (
                            <BanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-settings' && user?.role === 'teacher' && <TeacherSettings onNavigate={navigate} />}
                        {view === 'admin-settings' && (!user || user.role !== 'teacher') && <AdminSettings onNavigate={navigate} />}
                    </main>
                </div>
            );
        }
`;
