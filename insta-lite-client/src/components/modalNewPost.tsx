import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';
import { createPublication } from '../utils/api';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    newPost: Partial<PortfolioItem>;
    setNewPost: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
    addPost: (post: PortfolioItem) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, newPost, setNewPost, addPost }) => {
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string | null>(null); 

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPost.description || !newPost.visibility || !mediaFile) {
            toast.warn('⚠️ Veuillez remplir tous les champs obligatoires.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });            
            return;
        }

        try {
            const formData = new FormData();
            formData.append('description', newPost.description); 
            formData.append('postType', newPost.visibility.toUpperCase()); 
            formData.append('mediaFile', mediaFile);
            formData.append('mediaType', mediaType!);

            const createdPublication = await createPublication(formData);
            const createdPost: PortfolioItem = {
                id: createdPublication.id, 
                title: newPost.title!,
                description: newPost.description,
                imageUrl: createdPublication.mediaUrl, 
                location: newPost.location || '',
                visibility: newPost.visibility,
                comments: [],
            };

            addPost(createdPost);
            setNewPost({ title: '', description: '', visibility: 'public', location: '' });
            setMediaFile(null);
            setMediaPreview(null);
            toast.success('✅ Publication créée avec succès !', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
            
            onClose();
        } catch (error) {
            toast.error('❌ Une erreur est survenue lors de la création de la publication.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });        
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const mimeType = file.type;
            const fileSize = file.size;
            const MAX_IMAGE_SIZE = 2 * 1024 * 1024; 
            const MAX_VIDEO_SIZE = 30 * 1024 * 1024; 

            if (mimeType.startsWith('image/')) {
                setMediaType('IMAGE');
                if (fileSize > MAX_IMAGE_SIZE) {
                    try {
                        const compressedImage = await imageCompression(file, { maxSizeMB: 2 });
                        setMediaFile(compressedImage);
                        const reader = new FileReader();
                        reader.onload = () => setMediaPreview(reader.result as string);
                        reader.readAsDataURL(compressedImage);
                        toast.info('📸 Image compressée avec succès.', {
                            position: 'top-right',
                            autoClose: 3000,
                            theme: 'colored',
                        });
                    } catch (error) {
                        toast.error('❌ Erreur lors de la compression de l’image.', {
                            position: 'top-right',
                            autoClose: 3000,
                            theme: 'colored',
                        });                    
                    }
                } else {
                    setMediaFile(file);
                    const reader = new FileReader();
                    reader.onload = () => setMediaPreview(reader.result as string);
                    reader.readAsDataURL(file);
                }
            } else if (mimeType.startsWith('video/')) {
                setMediaType('VIDEO');
                if (fileSize > MAX_VIDEO_SIZE) {
                    toast.warn('⚠️ La taille de la vidéo dépasse 30 Mo.', {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });                
                } else {
                    setMediaFile(file);
                    const reader = new FileReader();
                    reader.onload = () => setMediaPreview(reader.result as string);
                    reader.readAsDataURL(file);
                    toast.info('🎥 Vidéo chargée avec succès.', {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                }
            } else {
                toast.error('❌ Seuls les fichiers image ou vidéo sont autorisés.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'colored',
                });            
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="text-2xl font-bold mb-4">Créer un Nouveau Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Description</label>
                        <textarea
                            value={newPost.description}
                            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Télécharger un fichier (image/vidéo)</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                        {mediaPreview && (
                            <div className="mt-4">
                                {mediaFile?.type.startsWith('image/') ? (
                                    <img src={mediaPreview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
                                ) : (
                                    <video src={mediaPreview} className="w-full h-48 object-cover rounded-lg" controls />
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Visibilité</label>
                        <select
                            value={newPost.visibility}
                            onChange={(e) =>
                                setNewPost({ ...newPost, visibility: e.target.value.toLowerCase() as 'public' | 'private' })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        >
                            <option value="public">Public</option>
                            <option value="private">Privé</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
                            Annuler
                        </button>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
