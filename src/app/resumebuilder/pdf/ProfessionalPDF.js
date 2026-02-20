'use client';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111',
    lineHeight: 1.5,
  },
  header: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 12, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  contactRow: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' },
  contactItem: { fontSize: 10, color: '#666', marginRight: 12, marginBottom: 2 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 6 },
  item: { marginBottom: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  itemSubTitle: { fontSize: 10, color: '#555' },
  date: { fontSize: 9, color: '#777' },
  description: { marginTop: 3, fontSize: 10, color: '#222' },
  skillLine: { fontSize: 10, marginBottom: 2 },
  skillLabel: { fontWeight: 'bold' },
})

export default function ProfessionalPDF({ resumeData }) {
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
  } = resumeData

  // ---------- Normalize helpers ----------
  const normalizeArray = (arr, key) => {
    if (!arr) return []
    if (Array.isArray(arr)) return arr.map(item => (typeof item === 'string' ? item : key ? item[key] : JSON.stringify(item)))
    if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean)
    return []
  }

  const technicalSkills = normalizeArray(skills.technical, 'name')
  const softSkills = normalizeArray(skills.soft, 'name')
  const normalizedCertifications = normalizeArray(certifications, 'name').map((c, i) =>
    typeof certifications[i] === 'object' ? `${c} — ${certifications[i].issuer || ''} (${certifications[i].year || ''})` : c
  )
  const normalizedLanguages = normalizeArray(languages, 'name').map((l, i) =>
    typeof languages[i] === 'object' ? `${l} (${languages[i].proficiency || ''})` : l
  )
  const normalizedAwards = normalizeArray(awards, 'title').map((a, i) =>
    typeof awards[i] === 'object' ? `${a} — ${awards[i].issuer || ''} (${awards[i].year || ''})` : a
  )
  const normalizedInterests = normalizeArray(interests)

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
        </View>
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text>{summary}</Text>
          </View>
        )}
        {experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((job, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{job.role}</Text>
                    <Text style={styles.itemSubTitle}>
                      {job.company}
                      {job.location ? ` • ${job.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.date}>{job.startDate} – {job.endDate || 'Present'}</Text>
                </View>
                {job.description && <Text style={styles.description}>{job.description}</Text>}
              </View>
            ))}
          </View>
        )}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                    <Text style={styles.itemSubTitle}>{edu.school}</Text>
                  </View>
                  <Text style={styles.date}>{edu.startDate} – {edu.endDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {(technicalSkills.length > 0 || softSkills.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {technicalSkills.length > 0 && <Text style={styles.skillLine}><Text style={styles.skillLabel}>Technical: </Text>{technicalSkills.join(', ')}</Text>}
            {softSkills.length > 0 && <Text style={styles.skillLine}><Text style={styles.skillLabel}>Soft: </Text>{softSkills.join(', ')}</Text>}
          </View>
        )}
        {projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{project.name}{project.link ? ` • ${project.link}` : ''}</Text>
                <Text style={styles.description}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}
        {normalizedCertifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {normalizedCertifications.map((c, i) => <Text key={i}>{c}</Text>)}
          </View>
        )}
        {normalizedLanguages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text>{normalizedLanguages.join(', ')}</Text>
          </View>
        )}
        {normalizedAwards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {normalizedAwards.map((a, i) => <Text key={i}>{a}</Text>)}
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
  )
}
