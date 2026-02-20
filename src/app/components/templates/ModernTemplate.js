'use client';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { normalizeArray } from '../../lib/templates';

const ACCENT = '#4a90e2';      // main accent color
const SECTION_BG = '#f0f4f8';   // subtle background for sections
const TEXT_MAIN = '#111';
const TEXT_MUTED = '#666';
const DIVIDER_COLOR = '#ddd';

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: TEXT_MAIN,
    lineHeight: 1.6,
  },

  
  header: {
    marginBottom: 32, // more breathing room
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    color: ACCENT,
  },
  contactRow: {
    marginTop: 16, // fixed spacing
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginRight: 16,
    marginBottom: 4,
  },

  divider: {
    marginTop: 18,
    height: 2,
    backgroundColor: ACCENT, // colored divider
  },

  
  section: {
    marginTop: 26,
    padding: 8,
    borderRadius: 4,
    backgroundColor: SECTION_BG,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: ACCENT,
    marginBottom: 8,
  },

  
  item: {
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: TEXT_MAIN,
  },
  itemMeta: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  description: {
    fontSize: 10.5,
    color: TEXT_MAIN,
    marginTop: 6,
  },

  
  inlineMeta: {
    fontSize: 10.5,
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default function ModernTemplate({ resumeData }) {
  const {
    personal,
    summary,
    experience,
    education,
    skills = {},
    projects,
    certifications,
    languages,
    awards,
    interests,
  } = resumeData;

  const technicalSkills = normalizeArray(skills.technical);
  const softSkills = normalizeArray(skills.soft);
  const normalizedInterests = normalizeArray(interests);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName}</Text>

          <View style={styles.contactRow}>
            {personal.email && <Text style={styles.contactItem}>{personal.email}</Text>}
            {personal.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
            {personal.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {personal.linkedin && <Text style={styles.contactItem}>{personal.linkedin}</Text>}
            {personal.github && <Text style={styles.contactItem}>{personal.github}</Text>}
            {personal.website && <Text style={styles.contactItem}>{personal.website}</Text>}
          </View>

          <View style={styles.divider} />
        </View>
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text>{summary}</Text>
          </View>
        )}
        {experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((job, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {job.role} · {job.company}
                </Text>
                <Text style={styles.itemMeta}>
                  {job.startDate} — {job.endDate || 'Present'}
                  {job.location ? ` · ${job.location}` : ''}
                </Text>
                {job.description && (
                  <Text style={styles.description}>{job.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
        {projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {project.name}
                  {project.link ? ` · ${project.link}` : ''}
                </Text>
                <Text style={styles.description}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ''}
                </Text>
                <Text style={styles.itemMeta}>
                  {edu.school} · {edu.startDate} — {edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        )}
        {(technicalSkills.length > 0 || softSkills.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {technicalSkills.length > 0 && (
              <Text style={styles.inlineMeta}>
                <Text style={styles.label}>Technical: </Text>
                {technicalSkills.join(', ')}
              </Text>
            )}
            {softSkills.length > 0 && (
              <Text style={styles.inlineMeta}>
                <Text style={styles.label}>Soft: </Text>
                {softSkills.join(', ')}
              </Text>
            )}
          </View>
        )}
        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, i) => (
              <Text key={i} style={styles.inlineMeta}>
                {cert.name} · {cert.issuer} ({cert.year})
              </Text>
            ))}
          </View>
        )}
        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {languages.map((lang, i) => (
              <Text key={i} style={styles.inlineMeta}>
                {lang.name} ({lang.proficiency})
              </Text>
            ))}
          </View>
        )}
        {awards?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {awards.map((award, i) => (
              <Text key={i} style={styles.inlineMeta}>
                {award.title} · {award.issuer} ({award.year})
              </Text>
            ))}
          </View>
        )}
        {normalizedInterests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text>{normalizedInterests.join(', ')}</Text>
          </View>
        )}

      </Page>
    </Document>
  );
}
