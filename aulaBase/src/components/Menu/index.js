import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../../styles/MenuStyles';

const Menu = ({ selected, onSelect }) => {
    const items = [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'produto', label: 'Produto', icon: '📦' },
        { key: 'estoque', label: 'Estoque', icon: '📋' },
        { key: 'fornecedor', label: 'Fornecedor', icon: '🏢' },
        { key: 'movimentacao', label: 'Movimentação', icon: '🔄' },
    ];

    const [hoveredKey, setHoveredKey] = useState(null);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Baita Estoque</Text>
                <Text style={styles.logoSubtext}>Sistema de Controle</Text>
            </View>

            <View style={styles.menuItemsContainer}>
                {items.map(item => {
                    const isActive = selected === item.key;
                    const isHovered = hoveredKey === item.key;
                    return (
                        <Pressable
                            key={item.key}
                            onPress={() => onSelect && onSelect(item.key)}
                            onHoverIn={() => setHoveredKey(item.key)}
                            onHoverOut={() => setHoveredKey(null)}
                            style={({ pressed }) => [
                                styles.menuItem,
                                (pressed || isHovered) && styles.menuItemPressed,
                                isActive && styles.menuItemActive,
                            ]}
                        >
                            <Text style={styles.menuItemIcon}>{item.icon}</Text>
                            <Text style={[styles.menuItemLabel, isActive && styles.menuItemLabelActive]}>
                                {item.label}
                            </Text>
                            {isActive && <View style={styles.menuItemActiveBar} />}
                            {!isActive && isHovered && <View style={styles.menuItemPressedBar} />}
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.profile}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}>JL</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Julios Latrel</Text>
                    <Text style={styles.profileRole}>Administrador</Text>
                </View>
            </View>
        </View>
    );
};

export default Menu;
