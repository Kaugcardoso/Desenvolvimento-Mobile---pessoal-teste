import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../../styles/MenuStyles';

const Menu = ({ selected, onSelect }) => {
    const items = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'produto', label: 'Produto' },
        { key: 'estoque', label: 'Estoque' },
        { key: 'fornecedor', label: 'Fornecedor' },
        { key: 'movimentacao', label: 'Movimentação' },
    ];

    const [hoveredKey, setHoveredKey] = useState(null);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={{ fontWeight: '700', color: '#0b3b60', fontSize: 16 }}>Baita Estoque</Text>
            </View>

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
                        <Text style={[styles.menuItemLabel, isActive && { color: '#fff', fontWeight: '600' }]}>{item.label}</Text>
                        {isActive && <View style={styles.menuItemActiveBar} />}
                        {!isActive && isHovered && <View style={styles.menuItemPressedBar} />}
                    </Pressable>
                );
            })}

            <View style={styles.profile}>
                <Text style={{ color: '#666', fontWeight: '600' }}>Julios Latrel</Text>
                <Text style={{ color: '#999', fontSize: 12 }}>Admin</Text>
            </View>
        </View>
    );
};

export default Menu;
