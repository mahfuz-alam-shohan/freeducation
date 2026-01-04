export const appRouting = `
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
                'public-bangla-ssc-videos': '/ssc/bangla-1st-paper/item/videos',
                'public-bangla-hsc-videos': '/hsc/bangla-1st-paper/item/videos',
                'public-ssc-ict': '/ssc/ict',
                'public-ssc-ict-mcq': '/ssc/ict/mcq',
                'public-hsc-ict': '/hsc/ict',
                'public-hsc-ict-topics': '/hsc/ict/topics',
                'public-hsc-ict-topic': '/hsc/ict/topic',
                'public-hsc-ict-cq': '/hsc/ict/cq',
                'public-hsc-ict-mcq': '/hsc/ict/mcq',
                'public-hsc-ict-videos': '/hsc/ict/videos',
                'public-ssc-physics': '/ssc/physics',
                'public-ssc-physics-topics': '/ssc/physics/topics',
                'public-ssc-physics-topic': '/ssc/physics/topic',
                'public-ssc-physics-cq': '/ssc/physics/cq',
                'public-ssc-physics-mcq': '/ssc/physics/mcq',
                'public-ssc-physics-videos': '/ssc/physics/videos',
                'public-ssc-chemistry': '/ssc/chemistry',
                'public-ssc-chemistry-topics': '/ssc/chemistry/topics',
                'public-ssc-chemistry-topic': '/ssc/chemistry/topic',
                'public-ssc-chemistry-cq': '/ssc/chemistry/cq',
                'public-ssc-chemistry-mcq': '/ssc/chemistry/mcq',
                'public-ssc-chemistry-videos': '/ssc/chemistry/videos',
                'public-ssc-biology': '/ssc/biology',
                'public-ssc-biology-topics': '/ssc/biology/topics',
                'public-ssc-biology-topic': '/ssc/biology/topic',
                'public-ssc-biology-cq': '/ssc/biology/cq',
                'public-ssc-biology-mcq': '/ssc/biology/mcq',
                'public-ssc-biology-videos': '/ssc/biology/videos',
                'public-ssc-bangladesh-global-studies': '/ssc/bangladesh-and-global-studies',
                'public-ssc-bangladesh-global-studies-topics': '/ssc/bangladesh-and-global-studies/topics',
                'public-ssc-bangladesh-global-studies-topic': '/ssc/bangladesh-and-global-studies/topic',
                'public-ssc-bangladesh-global-studies-cq': '/ssc/bangladesh-and-global-studies/cq',
                'public-ssc-bangladesh-global-studies-mcq': '/ssc/bangladesh-and-global-studies/mcq',
                'public-ssc-bangladesh-global-studies-videos': '/ssc/bangladesh-and-global-studies/videos',
                'public-ssc-religion': '/ssc/religion-and-moral-education',
                'public-ssc-religion-chapters': '/ssc/religion-and-moral-education/chapters',
                'public-ssc-religion-topics': '/ssc/religion-and-moral-education/topics',
                'public-ssc-religion-topic': '/ssc/religion-and-moral-education/topic',
                'public-ssc-religion-cq': '/ssc/religion-and-moral-education/cq',
                'public-ssc-religion-mcq': '/ssc/religion-and-moral-education/mcq',
                'public-ssc-religion-videos': '/ssc/religion-and-moral-education/videos',
                'public-hsc-physics-1st': '/hsc/physics-1st-paper',
                'public-hsc-physics-1st-topics': '/hsc/physics-1st-paper/topics',
                'public-hsc-physics-1st-topic': '/hsc/physics-1st-paper/topic',
                'public-hsc-physics-1st-cq': '/hsc/physics-1st-paper/cq',
                'public-hsc-physics-1st-mcq': '/hsc/physics-1st-paper/mcq',
                'public-hsc-physics-1st-videos': '/hsc/physics-1st-paper/videos',
                'public-hsc-physics-2nd': '/hsc/physics-2nd-paper',
                'public-hsc-physics-2nd-topics': '/hsc/physics-2nd-paper/topics',
                'public-hsc-physics-2nd-topic': '/hsc/physics-2nd-paper/topic',
                'public-hsc-physics-2nd-cq': '/hsc/physics-2nd-paper/cq',
                'public-hsc-physics-2nd-mcq': '/hsc/physics-2nd-paper/mcq',
                'public-hsc-physics-2nd-videos': '/hsc/physics-2nd-paper/videos',
                'public-hsc-chemistry-1st': '/hsc/chemistry-1st-paper',
                'public-hsc-chemistry-1st-topics': '/hsc/chemistry-1st-paper/topics',
                'public-hsc-chemistry-1st-topic': '/hsc/chemistry-1st-paper/topic',
                'public-hsc-chemistry-1st-cq': '/hsc/chemistry-1st-paper/cq',
                'public-hsc-chemistry-1st-mcq': '/hsc/chemistry-1st-paper/mcq',
                'public-hsc-chemistry-1st-videos': '/hsc/chemistry-1st-paper/videos',
                'public-hsc-chemistry-2nd': '/hsc/chemistry-2nd-paper',
                'public-hsc-chemistry-2nd-topics': '/hsc/chemistry-2nd-paper/topics',
                'public-hsc-chemistry-2nd-topic': '/hsc/chemistry-2nd-paper/topic',
                'public-hsc-chemistry-2nd-cq': '/hsc/chemistry-2nd-paper/cq',
                'public-hsc-chemistry-2nd-mcq': '/hsc/chemistry-2nd-paper/mcq',
                'public-hsc-chemistry-2nd-videos': '/hsc/chemistry-2nd-paper/videos',
                'public-hsc-biology-1st': '/hsc/biology-1st-paper',
                'public-hsc-biology-1st-topics': '/hsc/biology-1st-paper/topics',
                'public-hsc-biology-1st-topic': '/hsc/biology-1st-paper/topic',
                'public-hsc-biology-1st-cq': '/hsc/biology-1st-paper/cq',
                'public-hsc-biology-1st-mcq': '/hsc/biology-1st-paper/mcq',
                'public-hsc-biology-1st-videos': '/hsc/biology-1st-paper/videos',
                'public-hsc-biology-2nd': '/hsc/biology-2nd-paper',
                'public-hsc-biology-2nd-topics': '/hsc/biology-2nd-paper/topics',
                'public-hsc-biology-2nd-topic': '/hsc/biology-2nd-paper/topic',
                'public-hsc-biology-2nd-cq': '/hsc/biology-2nd-paper/cq',
                'public-hsc-biology-2nd-mcq': '/hsc/biology-2nd-paper/mcq',
                'public-hsc-biology-2nd-videos': '/hsc/biology-2nd-paper/videos',
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
                'admin-hsc-ict': '/dashboard/hsc/ict',
                'admin-hsc-ict-topics': '/dashboard/hsc/ict/topics',
                'admin-hsc-ict-topic': '/dashboard/hsc/ict/topic',
                'admin-hsc-ict-cq-types': '/dashboard/hsc/ict/cq',
                'admin-hsc-ict-cq-questions': '/dashboard/hsc/ict/cq/questions',
                'admin-hsc-ict-mcq': '/dashboard/hsc/ict/mcq',
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
                'admin-ssc-bangladesh-global-studies': '/dashboard/ssc/bangladesh-and-global-studies',
                'admin-ssc-bangladesh-global-studies-topics': '/dashboard/ssc/bangladesh-and-global-studies/topics',
                'admin-ssc-bangladesh-global-studies-topic': '/dashboard/ssc/bangladesh-and-global-studies/topic',
                'admin-ssc-bangladesh-global-studies-cq-types': '/dashboard/ssc/bangladesh-and-global-studies/cq',
                'admin-ssc-bangladesh-global-studies-cq-questions': '/dashboard/ssc/bangladesh-and-global-studies/cq/questions',
                'admin-ssc-bangladesh-global-studies-mcq': '/dashboard/ssc/bangladesh-and-global-studies/mcq',
                'admin-ssc-religion': '/dashboard/ssc/religion-and-moral-education',
                'admin-ssc-religion-chapters': '/dashboard/ssc/religion-and-moral-education/chapters',
                'admin-ssc-religion-topics': '/dashboard/ssc/religion-and-moral-education/topics',
                'admin-ssc-religion-topic': '/dashboard/ssc/religion-and-moral-education/topic',
                'admin-ssc-religion-cq-types': '/dashboard/ssc/religion-and-moral-education/cq',
                'admin-ssc-religion-cq-questions': '/dashboard/ssc/religion-and-moral-education/cq/questions',
                'admin-ssc-religion-mcq': '/dashboard/ssc/religion-and-moral-education/mcq',
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
                if (path.startsWith('/hsc/physics-1st-paper/videos')) return 'public-hsc-physics-1st-videos';
                if (path.startsWith('/hsc/physics-1st-paper/mcq')) return 'public-hsc-physics-1st-mcq';
                if (path.startsWith('/hsc/physics-1st-paper/cq')) return 'public-hsc-physics-1st-cq';
                if (path.startsWith('/hsc/physics-1st-paper/topic')) return 'public-hsc-physics-1st-topic';
                if (path.startsWith('/hsc/physics-1st-paper/topics')) return 'public-hsc-physics-1st-topics';
                if (path.startsWith('/hsc/physics-1st-paper')) return 'public-hsc-physics-1st';
                if (path.startsWith('/hsc/physics-2nd-paper/videos')) return 'public-hsc-physics-2nd-videos';
                if (path.startsWith('/hsc/physics-2nd-paper/mcq')) return 'public-hsc-physics-2nd-mcq';
                if (path.startsWith('/hsc/physics-2nd-paper/cq')) return 'public-hsc-physics-2nd-cq';
                if (path.startsWith('/hsc/physics-2nd-paper/topic')) return 'public-hsc-physics-2nd-topic';
                if (path.startsWith('/hsc/physics-2nd-paper/topics')) return 'public-hsc-physics-2nd-topics';
                if (path.startsWith('/hsc/physics-2nd-paper')) return 'public-hsc-physics-2nd';
                if (path.startsWith('/hsc/chemistry-1st-paper/videos')) return 'public-hsc-chemistry-1st-videos';
                if (path.startsWith('/hsc/chemistry-1st-paper/mcq')) return 'public-hsc-chemistry-1st-mcq';
                if (path.startsWith('/hsc/chemistry-1st-paper/cq')) return 'public-hsc-chemistry-1st-cq';
                if (path.startsWith('/hsc/chemistry-1st-paper/topic')) return 'public-hsc-chemistry-1st-topic';
                if (path.startsWith('/hsc/chemistry-1st-paper/topics')) return 'public-hsc-chemistry-1st-topics';
                if (path.startsWith('/hsc/chemistry-1st-paper')) return 'public-hsc-chemistry-1st';
                if (path.startsWith('/hsc/chemistry-2nd-paper/videos')) return 'public-hsc-chemistry-2nd-videos';
                if (path.startsWith('/hsc/chemistry-2nd-paper/mcq')) return 'public-hsc-chemistry-2nd-mcq';
                if (path.startsWith('/hsc/chemistry-2nd-paper/cq')) return 'public-hsc-chemistry-2nd-cq';
                if (path.startsWith('/hsc/chemistry-2nd-paper/topic')) return 'public-hsc-chemistry-2nd-topic';
                if (path.startsWith('/hsc/chemistry-2nd-paper/topics')) return 'public-hsc-chemistry-2nd-topics';
                if (path.startsWith('/hsc/chemistry-2nd-paper')) return 'public-hsc-chemistry-2nd';
                if (path.startsWith('/hsc/biology-1st-paper/videos')) return 'public-hsc-biology-1st-videos';
                if (path.startsWith('/hsc/biology-1st-paper/mcq')) return 'public-hsc-biology-1st-mcq';
                if (path.startsWith('/hsc/biology-1st-paper/cq')) return 'public-hsc-biology-1st-cq';
                if (path.startsWith('/hsc/biology-1st-paper/topic')) return 'public-hsc-biology-1st-topic';
                if (path.startsWith('/hsc/biology-1st-paper/topics')) return 'public-hsc-biology-1st-topics';
                if (path.startsWith('/hsc/biology-1st-paper')) return 'public-hsc-biology-1st';
                if (path.startsWith('/hsc/biology-2nd-paper/videos')) return 'public-hsc-biology-2nd-videos';
                if (path.startsWith('/hsc/biology-2nd-paper/mcq')) return 'public-hsc-biology-2nd-mcq';
                if (path.startsWith('/hsc/biology-2nd-paper/cq')) return 'public-hsc-biology-2nd-cq';
                if (path.startsWith('/hsc/biology-2nd-paper/topic')) return 'public-hsc-biology-2nd-topic';
                if (path.startsWith('/hsc/biology-2nd-paper/topics')) return 'public-hsc-biology-2nd-topics';
                if (path.startsWith('/hsc/biology-2nd-paper')) return 'public-hsc-biology-2nd';
                if (path.startsWith('/hsc/ict/videos')) return 'public-hsc-ict-videos';
                if (path.startsWith('/hsc/ict/mcq')) return 'public-hsc-ict-mcq';
                if (path.startsWith('/hsc/ict/cq')) return 'public-hsc-ict-cq';
                if (path.startsWith('/hsc/ict/topics')) return 'public-hsc-ict-topics';
                if (path.startsWith('/hsc/ict/topic')) return 'public-hsc-ict-topic';
                if (path.startsWith('/hsc/ict')) return 'public-hsc-ict';
                if (path.startsWith('/ssc/bangladesh-and-global-studies/videos')) return 'public-ssc-bangladesh-global-studies-videos';
                if (path.startsWith('/ssc/bangladesh-and-global-studies/mcq')) return 'public-ssc-bangladesh-global-studies-mcq';
                if (path.startsWith('/ssc/bangladesh-and-global-studies/cq')) return 'public-ssc-bangladesh-global-studies-cq';
                if (path.startsWith('/ssc/bangladesh-and-global-studies/topic')) return 'public-ssc-bangladesh-global-studies-topic';
                if (path.startsWith('/ssc/bangladesh-and-global-studies/topics')) return 'public-ssc-bangladesh-global-studies-topics';
                if (path.startsWith('/ssc/bangladesh-and-global-studies')) return 'public-ssc-bangladesh-global-studies';
                if (path.startsWith('/ssc/religion-and-moral-education/videos')) return 'public-ssc-religion-videos';
                if (path.startsWith('/ssc/religion-and-moral-education/mcq')) return 'public-ssc-religion-mcq';
                if (path.startsWith('/ssc/religion-and-moral-education/cq')) return 'public-ssc-religion-cq';
                if (path.startsWith('/ssc/religion-and-moral-education/topic')) return 'public-ssc-religion-topic';
                if (path.startsWith('/ssc/religion-and-moral-education/topics')) return 'public-ssc-religion-topics';
                if (path.startsWith('/ssc/religion-and-moral-education/chapters')) return 'public-ssc-religion-chapters';
                if (path.startsWith('/ssc/religion-and-moral-education')) return 'public-ssc-religion';
                if (path.startsWith('/ssc/physics/videos')) return 'public-ssc-physics-videos';
                if (path.startsWith('/ssc/physics/mcq')) return 'public-ssc-physics-mcq';
                if (path.startsWith('/ssc/physics/cq')) return 'public-ssc-physics-cq';
                if (path.startsWith('/ssc/physics/topic')) return 'public-ssc-physics-topic';
                if (path.startsWith('/ssc/physics/topics')) return 'public-ssc-physics-topics';
                if (path.startsWith('/ssc/physics')) return 'public-ssc-physics';
                if (path.startsWith('/ssc/chemistry/videos')) return 'public-ssc-chemistry-videos';
                if (path.startsWith('/ssc/chemistry/mcq')) return 'public-ssc-chemistry-mcq';
                if (path.startsWith('/ssc/chemistry/cq')) return 'public-ssc-chemistry-cq';
                if (path.startsWith('/ssc/chemistry/topic')) return 'public-ssc-chemistry-topic';
                if (path.startsWith('/ssc/chemistry/topics')) return 'public-ssc-chemistry-topics';
                if (path.startsWith('/ssc/chemistry')) return 'public-ssc-chemistry';
                if (path.startsWith('/ssc/biology/videos')) return 'public-ssc-biology-videos';
                if (path.startsWith('/ssc/biology/mcq')) return 'public-ssc-biology-mcq';
                if (path.startsWith('/ssc/biology/cq')) return 'public-ssc-biology-cq';
                if (path.startsWith('/ssc/biology/topic')) return 'public-ssc-biology-topic';
                if (path.startsWith('/ssc/biology/topics')) return 'public-ssc-biology-topics';
                if (path.startsWith('/ssc/biology')) return 'public-ssc-biology';
                if (path.startsWith('/ssc/ict/mcq')) return 'public-ssc-ict-mcq';
                if (path.startsWith('/ssc/ict')) return 'public-ssc-ict';
                if (path.startsWith('/ssc/bangla-1st-paper/item/videos')) return 'public-bangla-ssc-videos';
                if (path.startsWith('/ssc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-ssc-srijonshil';
                if (path.startsWith('/hsc/bangla-1st-paper/item/srijonshil')) return 'public-bangla-hsc-srijonshil';
                if (path.startsWith('/hsc/bangla-1st-paper/item/videos')) return 'public-bangla-hsc-videos';
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
                if (path.startsWith('/dashboard/hsc/ict/cq/questions')) return 'admin-hsc-ict-cq-questions';
                if (path.startsWith('/dashboard/hsc/ict/cq')) return 'admin-hsc-ict-cq-types';
                if (path.startsWith('/dashboard/hsc/ict/mcq')) return 'admin-hsc-ict-mcq';
                if (path.startsWith('/dashboard/hsc/ict/topics')) return 'admin-hsc-ict-topics';
                if (path.startsWith('/dashboard/hsc/ict/topic')) return 'admin-hsc-ict-topic';
                if (path.startsWith('/dashboard/hsc/ict')) return 'admin-hsc-ict';
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
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies/cq/questions'))
                    return 'admin-ssc-bangladesh-global-studies-cq-questions';
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies/cq')) return 'admin-ssc-bangladesh-global-studies-cq-types';
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies/mcq')) return 'admin-ssc-bangladesh-global-studies-mcq';
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies/topic')) return 'admin-ssc-bangladesh-global-studies-topic';
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies/topics')) return 'admin-ssc-bangladesh-global-studies-topics';
                if (path.startsWith('/dashboard/ssc/bangladesh-and-global-studies')) return 'admin-ssc-bangladesh-global-studies';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/cq/questions'))
                    return 'admin-ssc-religion-cq-questions';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/cq')) return 'admin-ssc-religion-cq-types';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/mcq')) return 'admin-ssc-religion-mcq';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/topic')) return 'admin-ssc-religion-topic';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/topics')) return 'admin-ssc-religion-topics';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education/chapters')) return 'admin-ssc-religion-chapters';
                if (path.startsWith('/dashboard/ssc/religion-and-moral-education')) return 'admin-ssc-religion';
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
`;
