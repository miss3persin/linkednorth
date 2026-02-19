import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const ACCENT = '#5c6bc0'; // subtle professional color
const SECTION_BG = '#f4f5fa'; // light panel for right column sections
const TEXT_MAIN = '#111';
const TEXT_MUTED = '#555';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: TEXT_MAIN,
    lineHeight: 1.5,
  },

  
  header: {
    marginBottom: 28, // slightly more space between name & contacts
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 14,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: ACCENT,
  },
  contactRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginRight: 14,
    marginBottom: 4,
  },

  
  body: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: '65%',
    paddingRight: 18,
  },
  rightColumn: {
    width: '35%',
    paddingLeft: 18,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },

  
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: ACCENT,
    marginBottom: 6,
  },
  sectionPanel: {
    backgroundColor: SECTION_BG,
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },

  
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_MAIN,
  },
  itemSubTitle: {
    fontSize: 10,
    color: TEXT_MUTED,
  },
  date: {
    fontSize: 9,
    color: '#777',
  },
  description: {
    marginTop: 4,
    fontSize: 10,
    color: TEXT_MAIN,
  },

  
  metaText: {
    fontSize: 10,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default function ProfessionalTemplate({ resumeData }) {
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

  const normalizeArray = (arr, key) => {
    if (!arr) return [];
    if (Array.isArray(arr))
      return arr.map(item =>
        typeof item === 'string' ? item : key ? item[key] : ''
      );
    if (typeof arr === 'string')
      return arr.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

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
        </View>
        <View style={styles.body}>
          <View style={styles.leftColumn}>
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
                      <Text style={styles.date}>
                        {job.startDate} – {job.endDate || 'Present'}
                      </Text>
                    </View>
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
                      {project.link ? ` • ${project.link}` : ''}
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
                    <View style={styles.itemHeader}>
                      <View>
                        <Text style={styles.itemTitle}>
                          {edu.degree}
                          {edu.field ? `, ${edu.field}` : ''}
                        </Text>
                        <Text style={styles.itemSubTitle}>{edu.school}</Text>
                      </View>
                      <Text style={styles.date}>
                        {edu.startDate} – {edu.endDate}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            {(technicalSkills.length > 0 || softSkills.length > 0) && (
              <View style={[styles.section, styles.sectionPanel]}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {technicalSkills.length > 0 && (
                  <Text style={styles.metaText}>
                    <Text style={styles.label}>Technical: </Text>
                    {technicalSkills.join(', ')}
                  </Text>
                )}
                {softSkills.length > 0 && (
                  <Text style={styles.metaText}>
                    <Text style={styles.label}>Soft: </Text>
                    {softSkills.join(', ')}
                  </Text>
                )}
              </View>
            )}

            {certifications?.length > 0 && (
              <View style={[styles.section, styles.sectionPanel]}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {certifications.map((cert, i) => (
                  <Text key={i} style={styles.metaText}>
                    {cert.name} — {cert.issuer} ({cert.year})
                  </Text>
                ))}
              </View>
            )}

            {languages?.length > 0 && (
              <View style={[styles.section, styles.sectionPanel]}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang, i) => (
                  <Text key={i} style={styles.metaText}>
                    {lang.name} ({lang.proficiency})
                  </Text>
                ))}
              </View>
            )}

            {awards?.length > 0 && (
              <View style={[styles.section, styles.sectionPanel]}>
                <Text style={styles.sectionTitle}>Awards</Text>
                {awards.map((award, i) => (
                  <Text key={i} style={styles.metaText}>
                    {award.title} — {award.issuer} ({award.year})
                  </Text>
                ))}
              </View>
            )}

            {normalizedInterests.length > 0 && (
              <View style={[styles.section, styles.sectionPanel]}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <Text style={styles.metaText}>
                  {normalizedInterests.join(', ')}
                </Text>
              </View>
            )}
          </View>

        </View>
      </Page>
    </Document>
  );
}
