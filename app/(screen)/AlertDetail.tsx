import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  Platform
} from 'react-native';
import {
  ArrowLeft, Clock, MessageSquare, CheckCircle, AlertTriangle, Flag,
  CreditCard, User, Smartphone, MapPin
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AlertType from '../type';

interface AlertDetailProps {
  alert: AlertType;
  onBack: () => void;
  onUpdateAlert: (id: number, updates: Partial<AlertType>) => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  default: '#6b7280',
};

const getSeverityColor = (severity: string) => SEVERITY_COLORS[severity] || SEVERITY_COLORS.default;

const formatTime = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
};

// ========================
// Subcomponents (inline)
// ========================

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <View style={styles.row}>
    {icon}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const SummaryCard = ({ alert }: { alert: AlertType }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.alertTitle}>{alert.title}</Text>
      <View style={[styles.statusPill, { backgroundColor: getSeverityColor(alert.severity) + '20' }]}>
        <Text style={[styles.severityTag, { color: getSeverityColor(alert.severity) }]}>
          {alert.severity}
        </Text>
      </View>
    </View>
    <Text style={styles.alertDesc}>{alert.description}</Text>
    <View style={[styles.row, { marginTop: 16 }]}>
      <Clock size={14} color="#6b7280" />
      <Text style={styles.timestamp}> {formatTime(alert.timestamp)}</Text>
    </View>
  </View>
);

const TransactionDetails = ({ alert }: { alert: AlertType }) => (
  <View style={styles.card}>
    <SectionHeader icon={<CreditCard size={16} color="#667eea" />} title="Transaction Details" />
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Amount</Text>
        <Text style={[styles.value, { fontWeight: '700' }]}>${alert.amount?.toLocaleString() || 'N/A'}</Text>
        <Text style={styles.label}>Merchant</Text>
        <Text style={styles.value}>{alert.merchant || 'Unknown Merchant'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{alert.transactionId || 'TXN-' + alert.id}</Text>
        <Text style={styles.label}>Card Last 4</Text>
        <Text style={styles.value}>•••• {alert.cardLast4 || '1234'}</Text>
      </View>
    </View>
  </View>
);

const UserInfo = ({ alert }: { alert: AlertType }) => (
  <View style={styles.card}>
    <SectionHeader icon={<User size={16} color="#667eea" />} title="User Information" />
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{alert.userId}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Risk Score</Text>
        <Text style={[styles.value, { color: getSeverityColor(alert.severity) }]}>{alert.riskScore}/100</Text>
      </View>
    </View>
  </View>
);

const DeviceLocation = ({ alert }: { alert: AlertType }) => (
  <View style={styles.card}>
    <SectionHeader icon={<Smartphone size={16} color="#667eea" />} title="Device & Location" />
    <Text style={styles.label}>Device</Text>
    <Text style={styles.value}>{alert.device}</Text>
    <View style={[styles.row, { marginTop: 20 }]}>
      <MapPin size={16} color="#6b7280" />
      <Text style={[styles.value, { marginTop: 0 }]}> {alert.location}</Text>
    </View>
  </View>
);

const ActionSection = ({ actionTaken, handleAction }: {
  actionTaken: string | null;
  handleAction: (action: string) => void;
}) => {
  if (actionTaken) {
    const messages: Record<string, string> = {
      safe: 'Alert has been marked as safe.',
      review: 'Alert flagged for review.',
      escalate: 'Alert escalated to senior team.'
    };
    return (
      <View style={[styles.card, { backgroundColor: '#f0fdf4', borderColor: '#16a34a', borderWidth: 0.5 }]}>
        <View style={styles.row}>
          <CheckCircle size={20} color="#16a34a" />
          <Text style={[styles.sectionTitle, { color: '#16a34a' }]}>Action Completed</Text>
        </View>
        <Text style={{ color: '#15803d', marginTop: 8 }}>{messages[actionTaken]}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Take Action</Text>
      <TouchableOpacity style={[styles.safeBtn, { marginTop: 16 }]} onPress={() => handleAction('safe')}>
        <CheckCircle size={20} color="white" />
        <Text style={[styles.btnText, { marginStart: 5 }]}>Mark as Safe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reviewBtn} onPress={() => handleAction('review')}>
        <Flag size={20} color="white" />
        <Text style={[styles.btnText, { marginStart: 5 }]}>Flag for Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.escalateBtn} onPress={() => handleAction('escalate')}>
        <AlertTriangle size={20} color="white" />
        <Text style={[styles.btnText, { marginStart: 5 }]}>Escalate</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeedbackSection = ({
  alert,
  showFeedback,
  setShowFeedback,
  feedback,
  setFeedback,
  submitFeedback
}: {
  alert: AlertType;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  feedback: string;
  setFeedback: (text: string) => void;
  submitFeedback: () => void;
}) => (
  <View style={styles.card}>
    <View style={styles.rowBetween}>
      <SectionHeader icon={<MessageSquare size={16} color="#667eea" />} title="Feedback" />
      {!showFeedback && (
        <TouchableOpacity onPress={() => setShowFeedback(true)} style={styles.feedbackBtn}>
          <Text style={styles.feedbackBtnText}>{alert.feedback ? 'Update Feedback' : 'Give Feedback'}</Text>
        </TouchableOpacity>
      )}
    </View>
    {showFeedback ? (
      <>
        <TextInput
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Share your thoughts..."
          multiline
          style={styles.textarea}
        />
        <View style={styles.feedbackActions}>
          <TouchableOpacity onPress={submitFeedback} disabled={!feedback?.trim()}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.submitBtn}
            >
              <Text style={styles.btnText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { setShowFeedback(false); setFeedback(alert.feedback || ''); }}
          >
            <Text style={styles.feedbackBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <Text style={styles.noFeedback}>{alert.feedback || 'No feedback provided yet.'}</Text>
    )}
  </View>
);

// ========================
// Main Component
// ========================

const AlertDetail = ({ alert, onBack, onUpdateAlert }: AlertDetailProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(alert.feedback || '');
  const [actionTaken, setActionTaken] = useState<string | null>(() => {
    if (alert.resolution === 'marked_safe') return 'safe';
    if (alert.resolution === 'flagged_for_review' || alert.status === 'under_review') return 'review';
    if (alert.resolution === 'escalated' || alert.status === 'escalated') return 'escalate';
    return null;
  });

  const handleAction = (action: string) => {
    let updates: Partial<AlertType> = { status: 'resolved' };
    if (action === 'safe') updates.resolution = 'marked_safe';
    else if (action === 'review') { updates.resolution = 'flagged_for_review'; updates.status = 'under_review'; }
    else if (action === 'escalate') { updates.resolution = 'escalated'; updates.status = 'escalated'; }

    onUpdateAlert(alert.id, updates);
    setActionTaken(action);
  };

  const submitFeedback = () => {
    if (feedback?.trim()) {
      onUpdateAlert(alert.id, { feedback: feedback.trim() });
      setShowFeedback(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Details</Text>
        <View style={[styles.severityDot, { backgroundColor: getSeverityColor(alert.severity) }]} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={Platform.OS == 'android' ? 100 : 0}
        enableOnAndroid
        overScrollMode="never"
        bounces={false}
        enableAutomaticScroll={true}

      >
        <SummaryCard alert={alert} />
        <TransactionDetails alert={alert} />
        <UserInfo alert={alert} />
        <DeviceLocation alert={alert} />
        <ActionSection actionTaken={actionTaken} handleAction={handleAction} />
        <FeedbackSection
          alert={alert}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          feedback={feedback}
          setFeedback={setFeedback}
          submitFeedback={submitFeedback}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 100, paddingTop: 10, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderColor: '#e5e7eb' },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginStart: 5 },
  severityDot: { width: 12, height: 12, borderRadius: 6, position: 'absolute', right: 15 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 18, margin: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  alertTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  alertDesc: { fontSize: 15, color: '#64748b', marginVertical: 8 },
  timestamp: { fontSize: 16, color: '#6b7280' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginStart: 5 },
  label: { fontSize: 12, color: '#6b7280', fontWeight: '600', marginTop: 16, textTransform: "uppercase" },
  value: { fontSize: 14, color: '#1e293b', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  safeBtn: { backgroundColor: '#10b981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 6, marginTop: 8 },
  reviewBtn: { backgroundColor: '#f59e0b', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 6, marginTop: 8 },
  escalateBtn: { backgroundColor: '#ef4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 6, marginTop: 8 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  textarea: { borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top', marginTop: 12, maxHeight: 200 },
  feedbackActions: { flexDirection: 'row', marginTop: 10 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6 },
  cancelBtn: { backgroundColor: '#F2F5F8', padding: 12, borderRadius: 6, marginStart: 15, borderColor: '#d1d5db', borderWidth: 0.5 },
  feedbackBtn: { backgroundColor: '#F2F5F8', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderColor: '#d1d5db', borderWidth: 0.5 },
  feedbackBtnText: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  noFeedback: { fontSize: 14, color: '#6b7280', marginTop: 12, fontStyle: 'italic' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, right: 0, position: 'absolute' },
  severityTag: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
});

export default AlertDetail;
