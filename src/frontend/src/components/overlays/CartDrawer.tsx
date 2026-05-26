import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    total,
    clearCart,
  } = useCart();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent className="max-h-[85vh]" data-ocid="cart-drawer">
        <DrawerHeader className="flex flex-row items-center justify-between pb-2">
          <DrawerTitle className="flex items-center gap-2 font-display">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart
            {items.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </DrawerTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closeCart}
            aria-label="Close cart"
            data-ocid="cart-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3"
              data-ocid="cart-empty"
            >
              <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Your cart is empty
              </p>
              <Button onClick={closeCart} variant="outline" size="sm">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.listingId.toString()}
                  className="flex gap-3 bg-muted/30 rounded-xl p-3"
                  data-ocid="cart-item"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.farmerName}
                    </p>
                    <p className="text-accent font-semibold text-sm mt-0.5">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeItem(item.listingId)}
                      aria-label="Remove item"
                      data-ocid="cart-remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex items-center gap-1 border border-border rounded-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() =>
                          updateQuantity(item.listingId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        data-ocid="cart-qty-minus"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() =>
                          updateQuantity(item.listingId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        data-ocid="cart-qty-plus"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display font-bold text-lg text-foreground">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-trust flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-trust" />
                Escrow-protected — funds released on delivery
              </p>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={clearCart}
                  data-ocid="cart-clear"
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground font-semibold"
                  data-ocid="cart-checkout"
                  onClick={() => {
                    closeCart();
                    toast.info("Proceeding to checkout...", {
                      duration: 4000,
                      icon: "🔒",
                    });
                  }}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
