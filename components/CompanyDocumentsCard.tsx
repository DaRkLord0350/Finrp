import React, { useState, useRef } from 'react';
import { CompanyDocument, DocumentStatus } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

const getDocumentStatusIcon = (status: DocumentStatus) => {
    switch(status) {
        case 'Uploaded': case 'Verified': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'Uploading': return <Spinner size="sm" />;
        case 'Not Uploaded': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
};

const CompanyDocumentsCard: React.FC = () => {
    const [documents, setDocuments] = useState<CompanyDocument[]>([
        { id: 'doc-pan', name: 'Company PAN Card', description: 'Permanent Account Number card of the business entity.', status: 'Not Uploaded' },
        { id: 'doc-gst', name: 'GST Certificate', description: 'Goods and Services Tax registration certificate.', status: 'Uploaded' },
        { id: 'doc-incorp', name: 'Certificate of Incorporation', description: 'Official document of company formation from the ROC.', status: 'Not Uploaded' },
        { id: 'doc-moa', name: 'Memorandum of Association', description: 'Governs the relationship between the company and the outside.', status: 'Not Uploaded' },
    ]);

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleUploadClick = (docId: string) => {
        fileInputRefs.current[docId]?.click();
    };

    const handleFileSelect = (docId: string, file: File | null) => {
        if (!file) return;

        setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'Uploading' } : d));

        // Simulate upload
        setTimeout(() => {
            setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'Uploaded' } : d));
        }, 2000);
    };

    return (
        <Card className="animate-fadeInUp anim-delay-400">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Company Documents</h3>
            <div className="space-y-3">
                {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center">
                            <div className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                {getDocumentStatusIcon(doc.status)}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{doc.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.status}</p>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={el => {fileInputRefs.current[doc.id] = el}}
                            className="hidden"
                            onChange={(e) => handleFileSelect(doc.id, e.target.files ? e.target.files[0] : null)}
                        />
                        {doc.status !== 'Uploading' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUploadClick(doc.id)}
                            >
                                {doc.status === 'Uploaded' || doc.status === 'Verified' ? 'View / Replace' : 'Upload'}
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default React.memo(CompanyDocumentsCard);
