import { requestJson } from './client.js';

export async function listSubjects() {
  return await requestJson('/api/v1/admin/subjects', { credentials: 'include' }, 'Failed to load subjects');
}

export async function createSubject(payload) {
  return await requestJson('/api/v1/admin/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to create subject');
}

export async function getSubject(id) {
  return await requestJson(`/api/v1/admin/subjects/${id}`, { credentials: 'include' }, 'Failed to load subject');
}

export async function updateSubject(id, payload) {
  return await requestJson(`/api/v1/admin/subjects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update subject');
}

export async function deleteSubject(id) {
  return await requestJson(`/api/v1/admin/subjects/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete subject');
}

export async function updateSubjectNode(subjectId, nodeId, payload) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/nodes/${nodeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update node');
}

export async function listSubjectChapters(subjectId, nodeId) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/chapters?nodeId=${nodeId}`, {
    credentials: 'include'
  }, 'Failed to load chapters');
}

export async function createSubjectChapter(subjectId, payload) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/chapters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to create chapter');
}

export async function updateSubjectChapter(subjectId, chapterId, payload) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/chapters/${chapterId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update chapter');
}

export async function deleteSubjectChapter(subjectId, chapterId) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/chapters/${chapterId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete chapter');
}

export async function listChapterTopics(chapterId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/topics`, {
    credentials: 'include'
  }, 'Failed to load topics');
}

export async function createTopic(chapterId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to create topic');
}

export async function updateTopic(chapterId, topicId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/topics/${topicId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update topic');
}

export async function deleteTopic(chapterId, topicId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/topics/${topicId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete topic');
}

export async function getTopicDetail(topicId) {
  return await requestJson(`/api/v1/admin/topics/${topicId}`, { credentials: 'include' }, 'Failed to load topic');
}

export async function getChapterDetail(chapterId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}`, { credentials: 'include' }, 'Failed to load chapter');
}

export async function addChapterNote(chapterId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add note');
}

export async function addTopicNote(topicId, payload) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add note');
}

export async function deleteChapterNote(chapterId, noteId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/notes/${noteId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete note');
}

export async function deleteTopicNote(topicId, noteId) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/notes/${noteId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete note');
}

export async function addChapterVideo(chapterId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add video');
}

export async function addTopicVideo(topicId, payload) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add video');
}

export async function deleteChapterVideo(chapterId, videoId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/videos/${videoId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete video');
}

export async function deleteTopicVideo(topicId, videoId) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/videos/${videoId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete video');
}

export async function addChapterQuestion(chapterId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add question');
}

export async function addTopicQuestion(topicId, payload) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to add question');
}

export async function updateChapterQuestion(chapterId, questionId, payload) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/questions/${questionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update question');
}

export async function updateTopicQuestion(topicId, questionId, payload) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/questions/${questionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update question');
}

export async function deleteChapterQuestion(chapterId, questionId) {
  return await requestJson(`/api/v1/admin/chapters/${chapterId}/questions/${questionId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete question');
}

export async function deleteTopicQuestion(topicId, questionId) {
  return await requestJson(`/api/v1/admin/topics/${topicId}/questions/${questionId}`, {
    method: 'DELETE',
    credentials: 'include'
  }, 'Failed to delete question');
}

export async function updateQuestionLabels(subjectId, payload) {
  return await requestJson(`/api/v1/admin/subjects/${subjectId}/question-labels`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }, 'Failed to update labels');
}
