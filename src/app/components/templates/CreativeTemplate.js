'use client';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { normalizeArray } from '../../lib/templates';

const ACCENT = '#7b2cbf';        // primary creative color
const SOFT_BG = '#f6effa';       // soft panel background
const TEXT_DARK = '#2d1b3d';
const TEXT_MUTED = '#5e4b73';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: TEXT_DARK,
    backgroundColor: '#ffffff',
    lineHeight: 1.6,
  },

  
  headerPanel: {
    backgroundColor: SOFT_BG,
    padding: 24,
    borderRadius: 8,
    marginBottom: 26,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: ACCENT,
    letterSpacing: 0.5,
    marginBottom: 14, // FIXES spacing issue you noticed
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginRight: 16,
    marginBottom: 6,
  },

  
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: ACCENT,
    marginBottom: 8,
    letterSpacing: 0.6,
  },

  
  item: {
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  itemMeta: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  description: {
    fontSize: 10.5,
    marginTop: 6,
    color: '#2f2f2f',
  },

  inlineText: {
    fontSize: 10.5,
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
});

export default function CreativeTemplate({ resumeData }) {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    interests,
  } = resumeData;

  const normalizedSkills = {
    technical: normalizeArray(skills?.technical),
    soft: normalizeArray(skills?.soft),
  };

  const normalizedInterests = normalizeArray(interests);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerPanel}>
          <Text style={styles.name}>{personal.fullName}</Text>

          <View style={styles.contactRow}>
            {personal.email && <Text style={styles.contactItem}>{personal.email}</Text>}
            {personal.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
            {personal.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {personal.linkedin && <Text style={styles.contactItem}>{personal.linkedin}</Text>}
            {personal.github && <Text style={styles.contactItem}>{personal.github}</Text>}
            {personal.website && <Text style={styles.contactItem}>{personal.website}</Text>}
          </View>
        </View>
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Story</Text>
            <Text>{summary}</Text>
          </View>
        )}
        {experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Highlights</Text>

            {experience.map((job, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {job.role} · {job.company}
                </Text>
                <Text style={styles.itemMeta}>
                  {job.startDate} — {job.endDate || 'Present'}
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
        {(normalizedSkills.technical.length > 0 || normalizedSkills.soft.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>

            {normalizedSkills.technical.length > 0 && (
              <Text style={styles.inlineText}>
                <Text style={styles.label}>Technical: </Text>
                {normalizedSkills.technical.join(', ')}
              </Text>
            )}

            {normalizedSkills.soft.length > 0 && (
              <Text style={styles.inlineText}>
                <Text style={styles.label}>Soft: </Text>
                {normalizedSkills.soft.join(', ')}
              </Text>
            )}
          </View>
        )}
        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, i) => (
              <Text key={i} style={styles.inlineText}>
                {cert.name} · {cert.issuer} ({cert.year})
              </Text>
            ))}
          </View>
        )}
        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {languages.map((lang, i) => (
              <Text key={i} style={styles.inlineText}>
                {lang.name} ({lang.proficiency})
              </Text>
            ))}
          </View>
        )}
        {awards?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {awards.map((award, i) => (
              <Text key={i} style={styles.inlineText}>
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
