'use client';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { normalizeArray } from '../../lib/templates';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f3e5f5',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  text: {
    marginBottom: 5,
    color: '#4a148c',
  },
});

const CreativePDF = ({ resumeData }) => {
  const { personal, summary, experience, education, skills, projects, certifications, languages, awards, interests } = resumeData;

  const technicalSkills = normalizeArray(skills?.technical);
  const softSkills = normalizeArray(skills?.soft);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{personal.fullName}</Text>
          <Text style={styles.text}>{personal.email}</Text>
          <Text style={styles.text}>{personal.phone}</Text>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.header}>Summary</Text>
            <Text>{summary}</Text>
          </View>
        )}

        {technicalSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Technical Skills</Text>
            {technicalSkills.map((skill, i) => (
              <Text key={i} style={styles.text}>{skill}</Text>
            ))}
          </View>
        )}

        {softSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Soft Skills</Text>
            {softSkills.map((skill, i) => (
              <Text key={i} style={styles.text}>{skill}</Text>
            ))}
          </View>
        )}

        {experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Experience</Text>
            {experience.map((job, index) => (
              <View key={index}>
                <Text>{job.role} at {job.company}</Text>
                <Text>{job.startDate} - {job.endDate}</Text>
                <Text>{job.description}</Text>
              </View>
            ))}
          </View>
        )}

        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Education</Text>
            {education.map((edu, i) => (
              <View key={i}>
                <Text style={styles.text}>{edu.degree} in {edu.field} - {edu.school}</Text>
                <Text style={styles.text}>{edu.startDate} - {edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}

        {projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Projects</Text>
            {projects.map((project, i) => (
              <View key={i}>
                <Text style={styles.text}>{project.name}</Text>
                <Text style={styles.text}>{project.description}</Text>
                {project.link && <Text style={styles.text}>{project.link}</Text>}
              </View>
            ))}
          </View>
        )}

        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Certifications</Text>
            {certifications.map((cert, i) => (
              <Text key={i} style={styles.text}>{cert.name} - {cert.issuer} ({cert.year})</Text>
            ))}
          </View>
        )}

        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Languages</Text>
            {languages.map((lang, i) => (
              <Text key={i} style={styles.text}>{lang.name} - {lang.proficiency}</Text>
            ))}
          </View>
        )}

        {awards?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Awards</Text>
            {awards.map((award, i) => (
              <Text key={i} style={styles.text}>{award.title} - {award.issuer} ({award.year})</Text>
            ))}
          </View>
        )}

        {interests && (
          <View style={styles.section}>
            <Text style={styles.header}>Interests</Text>
            <Text style={styles.text}>{interests}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CreativePDF;
