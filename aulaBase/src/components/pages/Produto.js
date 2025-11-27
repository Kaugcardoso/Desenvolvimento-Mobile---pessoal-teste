import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import pageStyles from '../../styles/PageStyles';
import sharedStyles, { colors, spacing, typography, borderRadius, shadows } from '../../styles/SharedStyles';
import { produtosApi } from '../../services/api';
import useOfflineMode from '../../hooks/useOfflineMode';

const Produto = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loadingProduto, setLoadingProduto] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        sku: '',
        valor: '',
        custo: '',
    });
    const offline = useOfflineMode();

    const carregar = useCallback(async () => {
        try {
            const data = await produtosApi.list();
            setProdutos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('[Produto] list', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const atualizarCampo = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const limparFormulario = () => {
        setForm({
            nome: '',
            sku: '',
            valor: '',
            custo: '',
        });
    };

    const abrirNovo = () => {
        setEditingId(null);
        limparFormulario();
        setModalVisible(true);
    };

    const abrirEdicao = async (produto) => {
        try {
            setLoadingProduto(true);
            setEditingId(produto.id);
            setForm({
                nome: produto.nome || '',
                sku: produto.sku || '',
                valor: produto.valor?.toString() || '0',
                custo: produto.custo?.toString() || '0',
            });
            setModalVisible(true);
        } catch (error) {
            console.error('[Produto] Erro ao carregar produto:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do produto.');
        } finally {
            setLoadingProduto(false);
        }
    };

    const fecharModal = () => {
        setModalVisible(false);
        setEditingId(null);
        limparFormulario();
    };

    const handleSalvar = async () => {
        if (!form.nome.trim()) {
            Alert.alert('Validação', 'Informe um nome para o produto.');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await produtosApi.update(editingId, {
                    nome: form.nome.trim(),
                    sku: form.sku?.trim() || null,
                    valor: Number(form.valor) || 0,
                    custo: Number(form.custo) || 0,
                });
                Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
            } else {
                await produtosApi.create({
                    nome: form.nome.trim(),
                    sku: form.sku?.trim() || null,
                    valor: Number(form.valor) || 0,
                    custo: Number(form.custo) || 0,
                });
                Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
            }
            fecharModal();
            carregar();
        } catch (error) {
            Alert.alert('Erro ao salvar', 'Não foi possível salvar o produto.');
            console.error('[Produto] save', error);
        } finally {
            setSaving(false);
        }
    };

    const confirmarExclusao = (id, nome) => {
        Alert.alert(
            'Excluir Produto',
            `Deseja realmente excluir o produto "${nome}"?\n\nEsta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await produtosApi.remove(id);
                            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
                            carregar();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o produto.');
                            console.error('[Produto] delete', error);
                        }
                    },
                },
            ]
        );
    };

    const formatarMoeda = (valor) => {
        return valor?.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        }) || 'R$ 0,00';
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={sharedStyles.card} 
            onPress={() => abrirEdicao(item)}
            onLongPress={() => confirmarExclusao(item.id, item.nome)}
            activeOpacity={0.7}
        >
            <View style={sharedStyles.cardHeader}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                    <Text style={sharedStyles.cardTitle}>{item.nome}</Text>
                    {item.sku && <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'monospace' }}>SKU: {item.sku}</Text>}
                </View>
                <View style={sharedStyles.badge}>
                    <Text style={sharedStyles.badgeText}>ID: {item.id}</Text>
                </View>
            </View>
            <View style={{ marginTop: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={[sharedStyles.valueSuccess, { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.xs }]}>Venda: {formatarMoeda(item.valor)}</Text>
                {item.custo && item.custo > 0 && (
                    <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xs }}>Custo: {formatarMoeda(item.custo)}</Text>
                )}
                {item.valor && item.custo && item.valor > 0 && item.custo > 0 && (
                    <Text style={[{ fontSize: 15, fontWeight: '600', marginBottom: spacing.xs }, item.valor > item.custo ? sharedStyles.valueSuccess : sharedStyles.valueDanger]}>
                        Margem: {((item.valor - item.custo) / item.valor * 100).toFixed(2)}%
                    </Text>
                )}
                <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginTop: spacing.xs }}>Estoque: {item.quantidade_total || 0}</Text>
            </View>
            <Text style={sharedStyles.cardHint}>Toque para editar • Segure para excluir</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[pageStyles.container, sharedStyles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={sharedStyles.loadingText}>Carregando produtos...</Text>
            </View>
    );
    }

    return (
        <View style={pageStyles.container}>
            <Text style={pageStyles.title}>Produtos</Text>

            {offline ? <Text style={sharedStyles.offline}>Modo offline: dados locais</Text> : null}

            <TouchableOpacity 
                style={sharedStyles.addButton} 
                onPress={abrirNovo}
            >
                <Text style={sharedStyles.addButtonText}>+ Adicionar Produto</Text>
            </TouchableOpacity>

            <FlatList
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    carregar();
                }}
                ListEmptyComponent={
                    <View style={sharedStyles.emptyContainer}>
                        <Text style={sharedStyles.emptyIcon}>📦</Text>
                        <Text style={sharedStyles.emptyTitle}>Nenhum produto cadastrado</Text>
                        <Text style={sharedStyles.emptyText}>
                            Toque em "Adicionar Produto" para cadastrar seu primeiro produto.
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />

            {/* Modal de Cadastro/Edição */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModal}
            >
                <View style={sharedStyles.modalOverlay}>
                    <View style={sharedStyles.modalContent}>
                        <View style={sharedStyles.modalHeader}>
                            <Text style={sharedStyles.modalTitle}>
                                {editingId ? 'Editar Produto' : 'Novo Produto'}
                            </Text>
                            <TouchableOpacity onPress={fecharModal}>
                                <Text style={sharedStyles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {loadingProduto ? (
                            <View style={sharedStyles.modalLoading}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={sharedStyles.modalLoadingText}>Carregando...</Text>
                            </View>
                        ) : (
                            <ScrollView 
                                style={sharedStyles.modalScrollView} 
                                contentContainerStyle={{ paddingBottom: spacing.xxxl }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={sharedStyles.modalForm}>
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Nome do produto *"
                                        value={form.nome}
                                        onChangeText={(text) => atualizarCampo('nome', text)}
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="SKU"
                                        value={form.sku}
                                        onChangeText={(text) => atualizarCampo('sku', text)}
                                        autoCapitalize="characters"
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Preço de Venda (R$)"
                                        keyboardType="decimal-pad"
                                        value={form.valor}
                                        onChangeText={(text) => atualizarCampo('valor', text.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Custo Unitário (R$)"
                                        keyboardType="decimal-pad"
                                        value={form.custo}
                                        onChangeText={(text) => atualizarCampo('custo', text.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                                    />
                                    {(() => {
                                        const valorNum = Number(form.valor) || 0;
                                        const custoNum = Number(form.custo) || 0;
                                        const margem = valorNum > 0 && custoNum > 0 
                                            ? ((valorNum - custoNum) / valorNum) * 100 
                                            : null;
                                        const lucro = valorNum - custoNum;
                                        return valorNum > 0 && custoNum > 0 ? (
                                            <View style={sharedStyles.infoBox}>
                                                <Text style={sharedStyles.infoBoxLabel}>💰 Margem de Lucro:</Text>
                                                <Text style={[sharedStyles.infoBoxValue, margem > 0 ? sharedStyles.valueSuccess : sharedStyles.valueDanger]}>
                                                    {margem.toFixed(2)}% ({lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade)
                                                </Text>
                                            </View>
                                        ) : valorNum > 0 || custoNum > 0 ? (
                                            <Text style={sharedStyles.modalInfo}>
                                                💡 Preencha o preço de venda e o custo para calcular a margem de lucro.
                                            </Text>
                                        ) : null;
                                    })()}
                                    <TouchableOpacity 
                                        style={[sharedStyles.modalButton, saving && sharedStyles.buttonDisabled]} 
                                        onPress={handleSalvar}
                                        disabled={saving}
                                    >
                                        <Text style={sharedStyles.modalButtonText}>
                                            {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={sharedStyles.modalCancelButton} onPress={fecharModal}>
                                        <Text style={sharedStyles.modalCancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Produto;

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    offline: {
        color: '#db8b0b',
        marginBottom: 6,
    },
    addButton: {
        backgroundColor: '#0b3b60',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    card: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flex: 1,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0b3b60',
        marginBottom: 4,
    },
    cardSku: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: 'monospace',
    },
    cardBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    cardBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#374151',
    },
    cardInfo: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669',
        marginBottom: 4,
    },
    cardCusto: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    cardMargem: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    margemPositiva: {
        color: '#059669',
    },
    margemNegativa: {
        color: '#dc2626',
    },
    cardQty: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
        marginTop: 4,
    },
    cardHint: {
        marginTop: 8,
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0b3b60',
    },
    modalClose: {
        fontSize: 24,
        color: '#6b7280',
        fontWeight: '300',
    },
    modalLoading: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalLoadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    modalScrollView: {
        maxHeight: 600,
    },
    modalForm: {
        padding: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#d5d5d5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#111827',
    },
    modalButton: {
        backgroundColor: '#0b3b60',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    modalCancelButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d5d5d5',
    },
    modalCancelButtonText: {
        color: '#6b7280',
        fontWeight: '600',
        fontSize: 16,
    },
    modalInfo: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: -8,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    margemPreview: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    margemPreviewLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0369a1',
        marginBottom: 4,
    },
    margemPreviewValue: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    valueSuccess: {
        color: '#059669',
    },
    valueDanger: {
        color: '#dc2626',
    },
});