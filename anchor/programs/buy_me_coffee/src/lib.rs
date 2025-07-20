#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

declare_id!("5d6hiEu8ZSGe31uubKUcD3VKTNVqFYCRDNfoP8aFubnu");

#[program]
pub mod buy_me_coffee {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;
    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey) -> Result<()> {
        let coffee_account = &mut ctx.accounts.coffee_account;
        coffee_account.owner = owner;
        coffee_account.total_amount = 0;
        coffee_account.purchase_count = 0;
        coffee_account.bump = ctx.bumps.coffee_account;
        Ok(())
    }

    pub fn buy_coffee(ctx: Context<BuyCoffee>, name: String, message: String, amount: u64) -> Result<()> {
        let coffee_account = &mut ctx.accounts.coffee_account;
        let coffee_purchase = &mut ctx.accounts.coffee_purchase;
        require!(amount > 0, CoffeeError::InvalidAmount);
        require!(name.len() <= 32, CoffeeError::NameTooLong);
        require!(message.len() <= 200, CoffeeError::MessageTooLong);

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.owner.to_account_info()
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, amount)?;

        coffee_account.total_amount += amount;
        coffee_purchase.buyer = ctx.accounts.buyer.key();
        coffee_purchase.name = name;
        coffee_purchase.message = message;
        coffee_purchase.amount = amount;
        coffee_purchase.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let coffee_account = &mut ctx.accounts.coffee_account;

        // require!(amount > 0, CoffeeError::InvalidAmount);
        require!(ctx.accounts.owner.key() == coffee_account.owner, CoffeeError::Unauthorized);
        // require!(coffee_account.to_account_info().lamports() >= amount, CoffeeError::InsufficientFunds);

        // let seeds = &[
        //     "coffee_account".as_bytes(), 
        //     &coffee_account.owner.to_bytes(), 
        //     &[coffee_account.bump]
        // ];
        // let signer_seeds = &[&seeds[..]];

        // let cpi_program = ctx.accounts.system_program.to_account_info();
        // let cpi_accounts = Transfer {
        //     from: coffee_account.to_account_info(),
        //     to: ctx.accounts.owner.to_account_info(),
        // };
        // let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        // transfer(cpi_ctx, amount)?;

        // coffee_account.total_amount -= amount;
        **ctx.accounts.coffee_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + CoffeeAccount::INIT_SPACE,
        seeds = [b"coffee_account", signer.key().as_ref()],
        bump
    )]
    pub coffee_account: Account<'info, CoffeeAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, message: String)]
pub struct BuyCoffee<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub coffee_account: Account<'info, CoffeeAccount>,
    #[account(
        init,
        payer = buyer,
        space = 8 + CoffeePurchase::INIT_SPACE,
        // seeds = [b"coffee_purchase", buyer.key().as_ref(), &Clock::get().unwrap().unix_timestamp.to_le_bytes()],
        seeds = [b"coffee_purchase", coffee_account.key().as_ref(), &coffee_account.purchase_count.to_le_bytes()],
        bump
    )]
    pub coffee_purchase: Account<'info, CoffeePurchase>,

    ///CHECK: This account will receive the SOL payment
    #[account(mut)]
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"coffee_account", owner.key().as_ref()],
        bump = coffee_account.bump
    )]
    pub coffee_account: Account<'info, CoffeeAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct CoffeeAccount {
    pub owner: Pubkey,
    pub purchase_count: u64,
    pub total_amount: u64,
    pub bump: u8
}

#[account]
#[derive(InitSpace)]
pub struct CoffeePurchase {
    pub buyer: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub message: String,
    pub amount: u64,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct CoffeePurchased {
    pub buyer: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub message: String,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum CoffeeError {
    #[msg("Invalid amount. Amount must be greater than 0.")]
    InvalidAmount,
    #[msg("Name is too long. Maximum 32 characters.")]
    NameTooLong,
    #[msg("Message is too long. Maximum 200 characters.")]
    MessageTooLong,
    #[msg("Unauthorized. Only the owner can perform this action.")]
    Unauthorized,
    #[msg("Insufficient funds for withdrawal.")]
    InsufficientFunds,
}