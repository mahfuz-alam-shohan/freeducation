ALTER TABLE subject_questions ADD COLUMN image_key TEXT;
ALTER TABLE subject_questions ADD COLUMN option_a TEXT;
ALTER TABLE subject_questions ADD COLUMN option_b TEXT;
ALTER TABLE subject_questions ADD COLUMN option_c TEXT;
ALTER TABLE subject_questions ADD COLUMN option_d TEXT;
ALTER TABLE subject_questions ADD COLUMN correct_option TEXT;

ALTER TABLE subject_topic_questions ADD COLUMN image_key TEXT;
ALTER TABLE subject_topic_questions ADD COLUMN option_a TEXT;
ALTER TABLE subject_topic_questions ADD COLUMN option_b TEXT;
ALTER TABLE subject_topic_questions ADD COLUMN option_c TEXT;
ALTER TABLE subject_topic_questions ADD COLUMN option_d TEXT;
ALTER TABLE subject_topic_questions ADD COLUMN correct_option TEXT;
