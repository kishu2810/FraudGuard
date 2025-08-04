import {
  AlertTriangle,
  Bell,
  ChevronRight,
  Clock,
  LogOut,
  Search,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AlertType from '../type';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  alerts: AlertType[];
  onAlertClick: (alert: AlertType) => void;
  onBack: () => void;
}

// === Utility ===
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

const formatTime = (timestamp: number | string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((+now - +date) / (1000 * 60));
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// === Subcomponents ===

const Header = ({
  alerts,
  onLogOut,
  searchTerm,
  setSearchTerm,
  filterSeverity,
  setFilterSeverity,
  open,
  setOpen
}: {
  alerts: AlertType[];
  onLogOut: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterSeverity: 'all' | 'high' | 'medium' | 'low';
  setFilterSeverity: React.Dispatch<React.SetStateAction<'all' | 'high' | 'medium' | 'low'>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      <View style={styles.headerTitle}>
        <Bell color="#667eea" size={24} style={{ marginRight: 12 }} />
        <Text style={styles.title}>Fraud Alerts</Text>
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>
            {alerts.filter(a => a.status === 'active').length} Active
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onLogOut}>
        <LogOut color="#ef4444" size={22} />
      </TouchableOpacity>
    </View>

    <SearchFilterBar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterSeverity={filterSeverity}
      setFilterSeverity={setFilterSeverity}
      open={open}
      setOpen={setOpen}
    />
  </View>
);


const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterSeverity,
  setFilterSeverity,
  open,
  setOpen,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterSeverity: 'all' | 'high' | 'medium' | 'low';
  setFilterSeverity: React.Dispatch<React.SetStateAction<'all' | 'high' | 'medium' | 'low'>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [items, setItems] = useState([
    { label: 'All', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ]);

  return (
    <View style={styles.searchFilterRow}>
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search alerts..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
      </View>
      <DropDownPicker
        open={open}
        value={filterSeverity}
        items={items}
        setOpen={setOpen}
        setValue={setFilterSeverity}
        setItems={setItems}
        style={styles.dropdown}
        containerStyle={{ width: 130 }}
        textStyle={{ fontSize: 14 }}
        dropDownContainerStyle={{ borderColor: '#d1d5db' }}
      />
    </View>
  );
};

const AlertCard = ({ alert, onPress }: { alert: AlertType; onPress: () => void }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{alert.title}</Text>
      <View style={[styles.statusPill]}>
        <Text style={[styles.severityTag, { color: getSeverityColor(alert.severity) }]}>
          {alert.severity}
        </Text>
      </View>
      <ChevronRight size={18} color="#9ca3af" />
    </View>
    <Text style={styles.cardDescription}>{alert.description}</Text>
    <View style={styles.cardFooter}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 13 }}>Status: </Text>
        <Text style={[
          { textTransform: 'capitalize' },
          alert.status === 'active' && styles.activeText
        ]}>
          {alert.status === 'under_review' ? 'Under Review' : alert.status}
        </Text>
      </View>
      <View style={styles.timeRow}>
        <Clock size={14} color="#9ca3af" style={{ marginRight: 4 }} />
        <Text style={styles.timeText}>{formatTime(alert.timestamp)}</Text>
      </View>
      <Text style={styles.amountTag}>${alert.amount?.toLocaleString() ?? 'N/A'}</Text>
    </View>
  </TouchableOpacity>
);

const EmptyState = () => (
  <View style={styles.emptyState}>
    <AlertTriangle size={48} color="#9ca3af" style={{ marginBottom: 12 }} />
    <Text style={styles.emptyTitle}>No alerts found</Text>
    <Text style={styles.emptyText}>Try adjusting your search or filter criteria</Text>
  </View>
);

// === Main Component ===

const AlertsList = ({ alerts, onAlertClick, onBack }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [open, setOpen] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSeverity === 'all' || alert.severity === filterSeverity;
    return matchesSearch && matchesFilter;
  });

  const onLogOut = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      onBack();
      Alert.alert('Success', 'Logout successful!');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        alerts={alerts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
        open={open}
        setOpen={setOpen}
        onLogOut={onLogOut}
      />
      <FlatList
        contentContainerStyle={styles.alertsList}
        data={filteredAlerts}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ListEmptyComponent={EmptyState}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={() => onAlertClick(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#ffffff', padding: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  activeBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginLeft: 12 },
  activeText: { fontSize: 12, color: '#dc2626', fontWeight: '600' },
  searchFilterRow: { flexDirection: 'row', gap: 12, zIndex: 10, paddingHorizontal: 16, marginBottom: 8 },
  searchWrapper: { flex: 1, position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 12, top: 15 },
  searchInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingLeft: 44, paddingVertical: 10, fontSize: 16, color: '#1e293b', paddingEnd: 10, height: 50 },
  dropdown: { backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: 8, height: 44 },
  alertsList: { padding: 20, gap: 12 },
  card: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 },
  statusPill: { paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  severityTag: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  cardDescription: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#9ca3af' },
  amountTag: { fontSize: 12, color: '#6b7280', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  emptyText: { fontSize: 14, color: '#6b7280' },
});

export default AlertsList;
