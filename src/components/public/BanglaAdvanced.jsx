// Advanced Bangla Components - MCQ, Srijonshil, etc.

import { PublicSimpleShell } from './PublicSimpleShell.jsx';

export const PublicBanglaSrijonshilDetail = ({ classLabel, itemName, categoryName, srijonshilQuestions, getQuestionKey, onNavigate }) => {
  const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
  const srijonshilTypes = [
    { key: 'gyan', label: 'জ্ঞান (জ্ঞান)' },
    { key: 'upokar', label: 'উপকার' },
    { key: 'biddya', label: 'বিদ্যা' },
    { key: 'mil', label: 'মিল' },
    { key: 'somosto', label: 'সমস্তো' },
    { key: 'proyab', label: 'প্রয়াব' },
    { key: 'proyojon', label: 'প্রয়োজন' },
    { key: 'niti', label: 'নীতি' }
  ];

  return (
    <PublicSimpleShell title={itemName} subtitle={categoryName} onBack={() => onNavigate('public-bangla-ssc-poddo')} onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-bangla">
        {/* Content Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{itemName}</h1>
          <p className="text-slate-600">{categoryName}</p>
        </div>

        {/* Srijonshil Types */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">সৃজনশীল প্রকার</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {srijonshilTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  window.location.hash = type.key;
                }}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-center"
              >
                <i className="fas fa-pen-fancy text-indigo-600 text-xl mb-2"></i>
                <div className="font-medium text-slate-900">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Questions Display */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-6">
            {srijonshilTypes.map((type) => {
              const questions = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
              
              return (
                <div key={type.key} id={type.key} className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                    {type.label}
                  </h3>
                  
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 mb-2">{question.question}</p>
                            {question.hint && (
                              <p className="text-sm text-slate-600 italic">ইঙ্গি: {question.hint}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PublicSimpleShell>
  );
};

export const PublicBanglaMcqDetail = ({ classLabel, itemName, categoryName, mcqQuestions, getQuestionKey, onNavigate }) => {
  const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
  const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
  const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');

  return (
    <PublicSimpleShell title={itemName} subtitle={categoryName} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-bangla">
        {/* MCQ Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{itemName}</h1>
          <p className="text-slate-600">বহুচিক্ত প্রশ্ন</p>
        </div>

        {/* MCQ Questions */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-8">
            {mcqList.map((mcq, index) => (
              <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {toBanglaNumber(index + 1)}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{mcq.question}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mcq.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => {
                        const isCorrect = optIndex === mcq.correctAnswer;
                        if (isCorrect) {
                          alert('সঠিক্ক উত্তর! Correct answer.');
                        } else {
                          alert('ভুল উত্তর. Try again.');
                        }
                      }}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        mcq.selectedAnswer === optIndex
                          ? mcq.selectedAnswer === mcq.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-slate-300 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {optionLabels[optIndex]}
                        </span>
                        <span className="flex-1 text-slate-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Correct Answer Display */}
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>সঠিক্ক উত্তর:</strong> {mcq.options[mcq.correctAnswer]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            পেছনে
          </button>
          
          <button
            onClick={() => onNavigate('public-bangla-ssc-poddo')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            সবার তালিকা
          </button>
        </div>
      </div>
    </PublicSimpleShell>
  );
};

export const PublicBanglaCreativeWriting = ({ classLabel, itemName, categoryName, onNavigate }) => {
  const [selectedType, setSelectedType] = useState('story');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const writingTypes = [
    { key: 'story', label: 'গল্পো', icon: 'fa-book' },
    { key: 'poem', label: 'কবিতা', icon: 'fa-feather' },
    { key: 'essay', label: 'রচনা', icon: 'fa-pen' },
    { key: 'dialogue', label: 'সংলাপ', icon: 'fa-comments' }
  ];

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('দযকতা লিখুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/creative-writing', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classLabel,
          itemName,
          categoryName,
          type: selectedType,
          content: content.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('সফলফ হয়েছে!');
        setContent('');
      } else {
        alert('সফলফ হয়নি: ' + data.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicSimpleShell title={itemName} subtitle={categoryName} onBack={() => onNavigate('public-bangla-ssc-goddo')} onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-bangla">
        {/* Writing Type Selection */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">সৃজনশীল প্রকার নির্বাচ</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {writingTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`p-4 border rounded-lg text-center transition-all ${
                  selectedType === type.key
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-300 bg-white hover:border-indigo-300'
                }`}
              >
                <i className={`fas ${type.icon} text-2xl mb-2 ${
                  selectedType === type.key ? 'text-indigo-600' : 'text-slate-400'
                }`}></i>
                <div className="font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Writing Area */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              আপনার লিখুন ({writingTypes.find(t => t.key === selectedType)?.label})
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bangla"
              placeholder="এখান লিখুন..."
            />
          </div>

          <div className="text-right text-sm text-slate-600 mb-4">
            {content.length} অক্ষর
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                জমাে হচ্ছ...
              </span>
            ) : (
              'জমা হচ্ছ'
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">নির্দেশনা</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• সৃজনশীল ও স্পষ্ট হবন</li>
            <li>• নিজের ব্যাকরণা ব্যবহার করুন</li>
            <li>• সৃজনশীল অনুযায় করুন</li>
            <li>• সময় ও সঠিক ব্যবহার করুন</li>
          </ul>
        </div>
      </div>
    </PublicSimpleShell>
  );
};
