import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1e293b',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    contactRow: {
        flexDirection: 'row',
        gap: 15,
        color: '#64748b',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#7c3aed',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 4,
    },
    summaryText: {
        lineHeight: 1.5,
        color: '#334155',
    },
    experienceItem: {
        marginBottom: 12,
    },
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    role: {
        fontWeight: 'bold',
        fontSize: 11,
        color: '#0f172a',
    },
    company: {
        color: '#7c3aed',
        fontWeight: 'medium',
        marginBottom: 4,
    },
    achievement: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10,
    },
    bullet: {
        width: 10,
    },
    achievementText: {
        flex: 1,
        lineHeight: 1.4,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        color: '#475569',
    },
    educationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    }
});

interface ResumePDFProps {
    data: any;
}

export const ResumePDF = ({ data }: ResumePDFProps) => {
    const { personalInfo, summary, skills, experience, education, projects } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo?.name}</Text>
                    <View style={styles.contactRow}>
                        {personalInfo?.email && <Text>{personalInfo.email}</Text>}
                        {personalInfo?.phone && <Text>{personalInfo.phone}</Text>}
                        {personalInfo?.location && <Text>{personalInfo.location}</Text>}
                    </View>
                    <View style={[styles.contactRow, { marginTop: 4 }]}>
                        {personalInfo?.linkedin && <Text>LinkedIn: {personalInfo.linkedin}</Text>}
                        {personalInfo?.github && <Text>GitHub: {personalInfo.github}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.summaryText}>{summary}</Text>
                    </View>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Core Competencies</Text>
                        <View style={styles.skillsContainer}>
                            {skills.map((skill: string, i: number) => (
                                <View key={i} style={styles.skillBadge}>
                                    <Text>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {experience.map((exp: any, i: number) => (
                            <View key={i} style={styles.experienceItem}>
                                <View style={styles.roleRow}>
                                    <Text style={styles.role}>{exp.role}</Text>
                                    <Text style={{ color: '#64748b' }}>{exp.duration}</Text>
                                </View>
                                <Text style={styles.company}>{exp.company}</Text>
                                {exp.achievements?.map((ach: string, j: number) => (
                                    <View key={j} style={styles.achievement}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.achievementText}>{ach}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu: any, i: number) => (
                            <View key={i} style={styles.educationItem}>
                                <View>
                                    <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                                    <Text style={{ color: '#64748b' }}>{edu.school}</Text>
                                </View>
                                <Text style={{ color: '#64748b' }}>{edu.year}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((proj: any, i: number) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <Text style={{ fontWeight: 'bold' }}>{proj.name}</Text>
                                <Text style={styles.summaryText}>{proj.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};
