import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import pageStyles from '../../styles/PageStyles';
import sharedStyles, { colors, spacing, typography, borderRadius, shadows } from '../../styles/SharedStyles';
import { movimentacoesApi } from '../../services/api';
import useOfflineMode from '../../hooks/useOfflineMode';

const Movimentacao = () => {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [form, setForm] = useState({
        produto_id: '',
        tipo: 'entrada',
        quantidade: '',
        observacao: '',
    });
    const offline = useOfflineMode();

    const carregar = useCallback(async () => {
        try {
            const data = await movimentacoesApi.list();
            setMovimentacoes(data);
        } catch (error) {
            console.error('[Movimentacao] list', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const atualizarCampo = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const limparFormulario = () =>
        setForm({
            produto_id: '',
            tipo: 'entrada',
            quantidade: '',
            observacao: '',
        });

    const handleSalvar = async () => {
        if (!form.produto_id || !form.quantidade) {
            Alert.alert('Validação', 'Informe o ID do produto e a quantidade.');
            return;
        }

        try {
            await movimentacoesApi.create({
                produto_id: Number(form.produto_id),
                tipo: form.tipo,
                quantidade: Number(form.quantidade),
                observacao: form.observacao,
            });
            limparFormulario();
            carregar();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível registrar a movimentação.');
            console.error('[Movimentacao] create', error);
        }
    };

    const confirmarExclusao = (id) => {
        Alert.alert('Excluir movimentação', 'Deseja desfazer esta movimentação?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await movimentacoesApi.remove(id);
                        carregar();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir.');
                        console.error('[Movimentacao] delete', error);
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={sharedStyles.card}>
            <View style={sharedStyles.cardHeader}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                    <Text style={sharedStyles.cardTitle}>{item.produto_nome}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs }}>ID {item.produto_id}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <View style={[sharedStyles.badge, { backgroundColor: item.tipo === 'entrada' ? colors.success : colors.danger, marginBottom: spacing.xs }]}>
                        <Text style={[sharedStyles.badgeText, { color: colors.textLight }]}>
                            {item.tipo.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>{item.quantidade}</Text>
                </View>
            </View>
            {item.observacao ? (
                <View style={[sharedStyles.infoBox, { marginTop: spacing.md }]}>
                    <Text style={sharedStyles.infoBoxLabel}>Observação:</Text>
                    <Text style={{ fontSize: 14, color: colors.textPrimary }}>{item.observacao}</Text>
                </View>
            ) : null}
            <TouchableOpacity 
                style={[sharedStyles.button, { backgroundColor: colors.dangerLight, marginTop: spacing.md }]} 
                onPress={() => confirmarExclusao(item.id)}
            >
                <Text style={[sharedStyles.buttonText, { color: colors.danger }]}>Remover</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={[pageStyles.container, sharedStyles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={sharedStyles.loadingText}>Carregando movimentações...</Text>
            </View>
        );
    }

    return (
        <View style={pageStyles.container}>
            <Text style={pageStyles.title}>Movimentações</Text>

            {offline ? <Text style={sharedStyles.offline}>Modo offline: dados locais</Text> : null}

            <View style={[sharedStyles.card, { marginBottom: spacing.lg }]}>
                <TextInput
                    style={sharedStyles.modalInput}
                    placeholder="ID do produto"
                    value={form.produto_id}
                    onChangeText={(text) => atualizarCampo('produto_id', text)}
                    keyboardType="numeric"
                />
                <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                    {['entrada', 'saida'].map((tipo, index, array) => (
                        <TouchableOpacity
                            key={tipo}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: colors.borderLight,
                                paddingVertical: spacing.md,
                                borderRadius: borderRadius.md,
                                alignItems: 'center',
                                marginRight: index === array.length - 1 ? 0 : spacing.md,
                                backgroundColor: form.tipo === tipo ? colors.primary : colors.backgroundLight,
                            }}
                            onPress={() => atualizarCampo('tipo', tipo)}
                        >
                            <Text
                                style={{
                                    color: form.tipo === tipo ? colors.textLight : colors.primary,
                                    fontWeight: '600',
                                }}
                            >
                                {tipo.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={sharedStyles.modalInput}
                    placeholder="Quantidade"
                    value={form.quantidade}
                    onChangeText={(text) => atualizarCampo('quantidade', text)}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[sharedStyles.modalInput, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Observação (opcional)"
                    value={form.observacao}
                    onChangeText={(text) => atualizarCampo('observacao', text)}
                    multiline
                    numberOfLines={3}
                />
                <TouchableOpacity style={sharedStyles.button} onPress={handleSalvar}>
                    <Text style={sharedStyles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                style={{ marginTop: 16 }}
                data={movimentacoes}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    carregar();
                }}
                ListEmptyComponent={
                    <View style={sharedStyles.emptyContainer}>
                        <Text style={sharedStyles.emptyIcon}>📋</Text>
                        <Text style={sharedStyles.emptyTitle}>Nenhuma movimentação</Text>
                        <Text style={sharedStyles.emptyText}>Ainda não há movimentações registradas.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default Movimentacao;

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d5d5d5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    typeRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    typeButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d5d5d5',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
    },
    typeButtonLast: {
        marginRight: 0,
    },
    typeButtonActive: {
        backgroundColor: '#0b3b60',
        borderColor: '#0b3b60',
    },
    typeButtonText: {
        color: '#0b3b60',
        fontWeight: '600',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
    button: {
        backgroundColor: '#4b6cb7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        elevation: 1,
        overflow: 'hidden',
    },
    rowContent: {
        padding: 14,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    rowLeft: {
        flex: 1,
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0b3b60',
    },
    rowSubtitle: {
        color: '#6b7280',
        fontSize: 12,
        marginTop: 2,
    },
    rowRight: {
        alignItems: 'flex-end',
    },
    observacaoBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#4b6cb7',
    },
    observacaoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    observacaoText: {
        fontSize: 14,
        color: '#111827',
    },
    deleteButton: {
        backgroundColor: '#fee2e2',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#dc2626',
        fontWeight: '600',
        fontSize: 14,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        color: '#fff',
        textAlign: 'center',
    },
    badgeEntrada: {
        backgroundColor: '#059669',
    },
    badgeSaida: {
        backgroundColor: '#d23939',
    },
    rowQty: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'right',
    },
    empty: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 24,
    },
    offline: {
        color: '#db8b0b',
        marginBottom: 6,
    },
});
