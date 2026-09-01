import React, { useState, useEffect } from 'react';
import { signaturesApi } from '../api/client';
import { generateSignatureHtml } from '../templates/templateGenerators';
import { X, FolderHeart, Trash2, Edit3, Plus, Loader2, Calendar, FileText } from 'lucide-react';

export const SavedSignaturesModal = ({ isOpen, onClose, onLoadSignature, onNewSignature }) => {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchSignatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await signaturesApi.list();
      setSignatures(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load saved signatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSignatures();
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved signature?')) return;
    setDeletingId(id);
    try {
      await signaturesApi.delete(id);
      setSignatures(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete signature');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Saved Signatures</h3>
              <p className="text-xs text-slate-400">Choose a saved preset to edit or copy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onNewSignature(); onClose(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
              <p className="text-xs font-medium">Loading your signatures...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          ) : signatures.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl p-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No saved signatures yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Customize your signature details in the editor and click "Save Signature" to keep it in your collection.
              </p>
              <button
                onClick={() => { onNewSignature(); onClose(); }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                Start Designing Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signatures.map((sig) => {
                const previewHtml = generateSignatureHtml(sig);
                return (
                  <div
                    key={sig.id}
                    className="group relative bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 rounded-xl p-4 transition-all hover:shadow-lg flex flex-col justify-between cursor-pointer"
                    onClick={() => { onLoadSignature(sig); onClose(); }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                            {sig.title || 'Untitled Signature'}
                          </h4>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Template: {sig.template_id?.replace('_', ' ') || 'modern horizon'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(sig.id, e)}
                          disabled={deletingId === sig.id}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete signature"
                        >
                          {deletingId === sig.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Mini Scaled Preview Container */}
                      <div className="p-3 bg-white rounded-lg my-2 overflow-hidden max-h-36 pointer-events-none select-none">
                        <div 
                          className="origin-top-left scale-[0.75] w-[133%]"
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(sig.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-brand-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        Edit in Studio &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
