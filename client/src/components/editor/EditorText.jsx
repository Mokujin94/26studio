import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import './editorText.scss';
import ImageUploader from '../../hooks/ImageUploader';
import { uploadPhoto } from '../../http/newsAPI';
import FunctionButton from '../functionButton/FunctionButton';

const EditorText = ({ onChange, editorInstanceRef, editorContainerRef }) => {

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!editorContainerRef.current) {
            return;
        }

        // Инициализация Editor.js
        editorInstanceRef.current = new EditorJS({
            holder: editorContainerRef.current,
            placeholder: 'Введите текст...',
            // Добавьте сюда настройки Editor.js, включая инструменты
            tools: {

                image: {
                    class: ImageTool,

                    config: {
                        uploader: {
                            uploadByFile: async (file) => {

                                const formData = new FormData();
                                formData.append('img', file); // 'img' должен совпадать с тем, что ожидается на сервере

                                try {
                                    const data = await uploadPhoto(formData); // Использование await для получения результата
                                    // Предполагается, что data содержит путь к изображению или объект с нужным полем
                                    return {
                                        success: 1,
                                        file: {
                                            url: process.env.REACT_APP_API_URL + '/' + data, // Формируем полный URL изображения
                                        },
                                    };
                                } catch (error) {
                                    return {
                                        success: 0,
                                        message: error.toString(),
                                    };
                                }
                            },
                        },
                    },
                },
            },
            data: {
                blocks: [
                    {
                        type: "paragraph",
                        data: {
                            text: "" // Оставьте текст пустым, чтобы отобразить placeholder
                        }
                    }
                ]
            },
            // Это событие срабатывает каждый раз, когда контент редактора изменяется
            onChange: () => {
                editorInstanceRef.current.save().then((content) => {
                    onChange(content); // Вызов функции обратного вызова с новым содержимым
                });
            },
        });

        // Очистка при размонтировании компонента
        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, [onChange]); // Обратите внимание, что useEffect зависит от функции onChange



    return (
        <div className="editor" ref={editorContainerRef}></div>
    );
};

export default EditorText;